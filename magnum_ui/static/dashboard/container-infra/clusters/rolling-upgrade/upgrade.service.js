/**
 * Copyright 2017 NEC Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name horizon.dashboard.container-infra.clusters.rolling-upgrade.service
   * @description Service for the container-infra cluster rolling upgrade modal.
   * Allows user to choose a Cluster template with higher version number the
   * cluster should upgrade to. Optionally, the number of nodes in a single
   * upgrade batch can be chosen.
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.rolling-upgrade.service', upgradeService);

  upgradeService.$inject = [
    '$q',
    '$document',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.dashboard.container-infra.utils.service'
  ];

  function upgradeService(
    $q, $document, magnum, actionResult, gettext, $qExtensions, modal, toast, spinnerModal,
    resourceType, utils
  ) {

    var modalConfig, formModel, isLatestTemplate, clusterTemplatesTitleMap;

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected, $scope) {
      // Simulate a click to dismiss opened action dropdown, otherwise it could interfere with
      // correct behaviour of other dropdowns.
      $document[0].body.click();

      var deferred = $q.defer();
      spinnerModal.showModalSpinner(gettext('Loading'));

      var activeTemplateVersion, activeTemplateId;

      magnum.getCluster(selected.id).then(function(response) {
        formModel = getFormModelDefaults();
        formModel.id = selected.id;
        clusterTemplatesTitleMap = [
          // Default <select> placeholder
          {
            value:'',
            name: gettext("Choose a Cluster Template to upgrade to")
          }
        ];

        processClusterResponse(response.data);

        // Retrieve only cluster templates related to the current one.
        return magnum.getClusterTemplates(activeTemplateId);
      }).then(function(response) {
        processClusterTemplatesResponse(response.data.items);

        modalConfig = createModalConfig();

        deferred.resolve(modal.open(modalConfig).then(onModalSubmit));
        spinnerModal.hideModalSpinner();

        $scope.model = formModel;
      }).catch(onError);

      function processClusterResponse(cluster) {
        formModel.master_nodes = cluster.master_count;
        formModel.worker_nodes = cluster.node_count;

        activeTemplateVersion = cluster.labels.kube_tag;
        activeTemplateId = cluster.cluster_template_id;
      }

      function processClusterTemplatesResponse(clusterTemplates) {
        if (!clusterTemplates) { return; }

        var startingTemplatesTitleMapLength = clusterTemplatesTitleMap.length;

        // Only load templates that are greater than the current template (kube tag comparison)
        clusterTemplates.forEach(function(template) {
          if (isVersionGreater(activeTemplateVersion, template.labels.kube_tag)) {
            clusterTemplatesTitleMap.push({
              value: template.id,
              name: template.name
            });
          }
        });

        // Order templates by name in descending order
        clusterTemplatesTitleMap.sort(function(firstTemplate, secondTemplate) {
          return firstTemplate.name < secondTemplate.name ? 1 : -1;
        });

        // If nothing has been added to the map => already on latest template
        isLatestTemplate = startingTemplatesTitleMapLength === clusterTemplatesTitleMap.length;
      }

      function onError(err) {
        spinnerModal.hideModalSpinner();
        deferred.promise.catch(angular.noop);
        return deferred.reject(err);
      }

      return deferred.promise;
    }

    function createModalConfig() {
      return {
        title: gettext('Rolling Cluster Upgrade'),
        schema: {
          type: 'object',
          properties: {
            'cluster_template_id': {
              title: gettext('New Cluster Template'),
              type: 'string'
            },
            'max_batch_size': {
              title: gettext('Maximum Batch Size'),
              type: 'number',
              minimum: 1
            }
          }
        },
        form: [
          {
            key: 'cluster_template_id',
            type: 'select',
            titleMap: clusterTemplatesTitleMap,
            required: true,
            readonly: isLatestTemplate,
            description: isLatestTemplate
              ? gettext('<em>This cluster is already on the latest compatible template</em>') : null
          },
          {
            key: 'max_batch_size',
            placeholder: gettext('The cluster node count.'),
            // Disable if there's nothing to upgrade or if the the default value incrementation
            // would fail the validation.
            readonly: isLatestTemplate ||
              !isBatchSizeValid(getFormModelDefaults().max_batch_size + 1),
            validationMessage: {
              sizeExceeded: gettext('The maximum number of nodes in the batch has been exceeded.'),
              101: gettext('A batch cannot have less than one node.')
            },
            $validators: {
              sizeExceeded: isBatchSizeValid
            }
          }
        ],
        model: formModel
      };
    }

    function getFormModelDefaults() {
      return {
        cluster_template_id: '',
        max_batch_size: 1
      };
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function isBatchSizeValid(batchSize) {
      return batchSize &&
        (batchSize === 1 ||
        batchSize <= formModel.master_nodes / 3 && batchSize <= formModel.worker_nodes / 5);
    }

    function onModalSubmit() {
      return magnum.upgradeCluster(formModel.id, {
        cluster_template: formModel.cluster_template_id,
        max_batch_size: formModel.max_batch_size,
        nodegroup: 'default-worker'
      }).then(onRequestSuccess);
    }

    function onRequestSuccess() {
      toast.add('success', gettext('Cluster is being upgraded to the new Cluster template'));
      return actionResult.getActionResult()
        .updated(resourceType, formModel.id)
        .result;
    }

    function isVersionGreater(v1, v2) {
      if (!v1 || !v2) { return null; }

      // Strip the 'v' if prefixed in the version
      if (v1[0] === 'v') { v1 = v1.substr(1); }
      if (v2[0] === 'v') { v2 = v2.substr(1); }
      return utils.versionCompare(v1, v2) < 0;
    }

  }
})();
