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
   * @name horizon.dashboard.container-infra.clusters.resize.service
   * @description Service for the container-infra cluster resize modal.
   * Allows user to select new number of worker nodes and if the number
   * is reduced, nodes to be removed can be selected from the list.
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.resize.service',
    resizeService);

  resizeService.$inject = [
    '$rootScope',
    '$q',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.dashboard.container-infra.clusters.resourceType'
  ];

  function resizeService(
    $rootScope, $q, magnum, actionResult, gettext, $qExtensions, modal, toast, spinnerModal,
    resourceType
  ) {

    var modalConfig, formModel;

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected, $scope) {
      var deferred = $q.defer();
      spinnerModal.showModalSpinner(gettext('Loading'));

      magnum.getClusterNodes(selected.id)
        .then(onLoad)
        .catch(hideSpinnerOnError);

      function onLoad(response) {
        formModel = getFormModelDefaults();
        formModel.id = selected.id;

        modalConfig = constructModalConfig(response.data.worker_nodes);

        deferred.resolve(modal.open(modalConfig).then(onModalSubmit));
        $scope.model = formModel;

        spinnerModal.hideModalSpinner();
      }

      function hideSpinnerOnError(error) {
        spinnerModal.hideModalSpinner();
        deferred.promise.catch(angular.noop);
        return deferred.reject(error);
      }

      return deferred.promise;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function constructModalConfig(workerNodesList) {
      formModel.original_node_count = workerNodesList.length;
      formModel.node_count = workerNodesList.length;

      return {
        title: gettext('Resize Cluster'),
        schema: {
          type: 'object',
          properties: {
            'node_count': {
              type: 'number',
              minimum: 0
            },
            'nodes_to_remove': {
              type: 'array',
              items: {
                type: 'string'
              },
              minItems: 0 // Must be specified to avoid obsolete validation errors
            }
          }
        },
        form: [
          {
            key: 'node_count',
            title: gettext('Node Count'),
            placeholder: gettext('The cluster node count.'),
            required: true,
            validationMessage: {
              101: gettext('You cannot resize to fewer than zero worker nodes.')
            },
            onChange: validateNodeRemovalCount
          },
          {
            key: 'nodes_to_remove',
            type: 'checkboxes',
            title: gettext('Choose nodes to remove (Optional)'),
            titleMap: generateNodesTitleMap(workerNodesList),
            condition: 'model.node_count < model.original_node_count',
            onChange: validateNodeRemovalCount,
            validationMessage: {
              nodeRemovalCountExceeded: gettext('You may only select as many nodes ' +
                'as you are reducing the original node count by.')
            }
          }
        ],
        model: formModel
      };
    }

    // Invalid when user selects more Worker Nodes (checkboxes) than is allowed to be removed
    function validateNodeRemovalCount() {
      var selectedNodesCount = formModel.nodes_to_remove ? formModel.nodes_to_remove.length : 0;
      var maximumNodesCount = formModel.original_node_count - formModel.node_count;

      if (selectedNodesCount <= maximumNodesCount) {
        broadcastNodeRemovalValid();
      } else {
        broadcastNodeRemovalInvalid();
      }

      function broadcastNodeRemovalInvalid() {
        $rootScope.$broadcast('schemaForm.error.nodes_to_remove',
          'nodeRemovalCountExceeded', false);
      }
      function broadcastNodeRemovalValid() {
        $rootScope.$broadcast('schemaForm.error.nodes_to_remove',
          'nodeRemovalCountExceeded', true);
      }
    }

    function getFormModelDefaults() {
      return {
        original_node_count: null,
        node_count: null,
        nodes_to_remove: []
      };
    }

    function generateNodesTitleMap(nodesList) {
      return nodesList.map(function(node) {
        return {
          value: node.id,
          name: node.name
        };
      });
    }

    function onModalSubmit() {
      var postRequestObject = {
        node_count: formModel.node_count,
        nodegroup: 'default-worker'
      };

      if (formModel.node_count < formModel.original_node_count &&
        formModel.nodes_to_remove && formModel.nodes_to_remove.length > 0) {
        postRequestObject.nodes_to_remove = formModel.nodes_to_remove;
      }

      return magnum.resizeCluster(formModel.id, postRequestObject)
        .then(onRequestSuccess);
    }

    function onRequestSuccess() {
      toast.add('success', gettext('Cluster is being resized.'));
      return actionResult.getActionResult()
        .updated(resourceType, formModel.id)
        .result;
    }
  }
})();
