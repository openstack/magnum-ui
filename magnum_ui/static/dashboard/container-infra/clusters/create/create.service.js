/**
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
   * @name horizon.dashboard.container-infra.clusters.create.service
   * @description Service for the container-infra 'Create New Cluster' dialog.
   * Also responsible for processing the user submission.
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.create.service', createService);

  createService.$inject = [
    '$location',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.dashboard.container-infra.clusters.workflow'
  ];

  function createService(
    $location, magnum, actionResult, gettext, $qExtensions, modal, toast, spinnerModal,
    resourceType, workflow
  ) {

    var modalConfig;
    var message = {
      success: gettext('Cluster %s was successfully created.')
    };

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected, $scope) {
      spinnerModal.showModalSpinner(gettext('Loading'));

      function onCreateWorkflowConfig(config) {
        modalConfig = config;
        spinnerModal.hideModalSpinner();
        return modal.open(modalConfig).then(onModalSubmit);
      }

      return workflow.init(gettext('Create New Cluster'), $scope)
        .then(onCreateWorkflowConfig)
        .catch(hideSpinnerOnError);
    }

    function hideSpinnerOnError(error) {
      spinnerModal.hideModalSpinner();
      return error;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function onModalSubmit(context) {
      return magnum.createCluster(buildRequestObject(context.model), false)
              .then(onRequestSuccess, true);
    }

    function buildRequestObject(model) {
      var MODEL_DEFAULTS = model.DEFAULTS;
      var requestLabels = {};

      var requestObject = {
        // Defaults required by the endpoint
        discovery_url: null,
        create_timeout: 60,
        rollback: false,

        // Form fields
        name: model.name,
        cluster_template_id: model.cluster_template_id,
        keypair: model.keypair,
        floating_ip_enabled: model.floating_ip_enabled,
        labels: requestLabels,
        master_lb_enabled: model.master_lb_enabled
      };

      // Optional request fields
      addFieldToRequestObjectIfSet('master_count','master_count');
      addFieldToRequestObjectIfSet('master_flavor_id','master_flavor_id');
      addFieldToRequestObjectIfSet('node_count','node_count');
      addFieldToRequestObjectIfSet('flavor_id','flavor_id');

      if (!model.create_network) {
        addFieldToRequestObjectIfSet('fixed_network','fixed_network');
        addFieldToRequestObjectIfSet('fixed_subnet','fixed_subnet');
      }
      // Labels processing order (the following overrides previous):
      // Cluster Templates -> Create Form -> User-defined in 'labels' textarea

      // 1) Cluster Templates labels
      if (model.templateLabels) {
        angular.extend(requestLabels, model.templateLabels);
      }

      // 2) Create Workflow Form labels
      requestLabels.availability_zone = model.availability_zone;
      requestLabels.auto_scaling_enabled = model.auto_scaling_enabled;
      requestLabels.auto_healing_enabled = model.auto_healing_enabled;

      if (model.auto_scaling_enabled) {
        requestLabels.min_node_count = model.min_node_count;
        requestLabels.max_node_count = model.max_node_count;
      }

      // 2A) Labels from user-selected addons
      angular.forEach(model.addons, function(addon) {
        angular.extend(requestLabels, addon.labels);
      });
      // 2B) Labels from user-selected ingress controller
      if (model.ingress_controller && model.ingress_controller.labels) {
        angular.extend(requestLabels, model.ingress_controller.labels);
      }

      // 3) User-defined Custom labels
      // Parse all labels comma-separated key=value pairs and inject them into request object
      if (model.labels !== MODEL_DEFAULTS.labels) {
        try {
          model.labels.split(',').forEach(function(kvPair) {
            var pairsList = kvPair.split('=');

            // Remove leading and trailing whitespaces & convert to l-case
            var labelKey = pairsList[0].trim().toLowerCase();
            var labelValue = pairsList[1].trim().toLowerCase();

            if (labelValue) {
              // Only override existing label values if user override flag is true
              if (!requestLabels.hasOwnProperty(labelKey) || model.override_labels) {
                requestLabels[labelKey] = labelValue;
              }
            }
          });
        } catch (err) {
          toast.add('error', gettext('Unable to process `Additional Labels`. ' +
            'Not all labels will be applied.'));
        }
      }

      // Only add to the request Object if set (= not default)
      function addFieldToRequestObjectIfSet(requestFieldName, modelFieldName) {
        if (model[modelFieldName] !== MODEL_DEFAULTS[modelFieldName]) {
          requestObject[requestFieldName] = model[modelFieldName];
        }
      }

      return requestObject;
    }

    function onRequestSuccess(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));

      var result = actionResult.getActionResult()
                     .created(resourceType, response.data.id);

      if (result.result.failed.length === 0 && result.result.created.length > 0) {
        $location.path('/project/clusters');
      }

      return result.result;
    }
  }
})();
