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
   * @ngdoc controller
   * @name clusterTemplateController
   * @ngController
   *
   * @description
   * Controller to show cluster template info for info step in workflow
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller(
      'horizon.dashboard.container-infra.clusters.workflow.clusterTemplateController',
      clusterTemplateController);

  clusterTemplateController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function clusterTemplateController($scope, magnum) {
    var ctrl = this;
    init();

    function init() {
      ctrl.clusterTemplate = {
        name: "",
        id: "",
        coe: "",
        image_id: "",
        public: "",
        registry_enabled: "",
        tls_disabled: "",
        apiserver_port: "",
        keypair_id: "",
        docker_volume_size: ""
      };
    }

    loadClusterTemplate($scope.model.cluster_template_id);

    function loadClusterTemplate(id, old) {
      if (id !== old) {
        if (id === '' || typeof id === 'undefined') {
          $scope.model.keypair = "";
          init();
        } else {
          magnum.getClusterTemplate(id).then(onGetClusterTemplate);
        }
      }
    }

    function onGetClusterTemplate(response) {
      var MODEL_DEFAULTS = $scope.model.DEFAULTS;
      var template = response.data;

      ctrl.clusterTemplate = template;

      // master_lb_enabled=false? Only allow a single Master Node
      $scope.model.isSingleMasterNode = template.hasOwnProperty('master_lb_enabled') &&
        template.master_lb_enabled === false;
      $scope.model.master_count = $scope.model.isSingleMasterNode ? 1 : $scope.model.master_count;

      // Only alter the model if the value is default and exists in the response
      // Warning: This is loosely coupled with default states.
      // Sets response.key -> model.key
      setResponseAsDefaultIfUnset('keypair_id', 'keypair');
      setResponseAsDefaultIfUnset('master_count', 'master_count');
      setResponseAsDefaultIfUnset('master_flavor_id', 'master_flavor_id');
      setResponseAsDefaultIfUnset('node_count', 'node_count');
      setResponseAsDefaultIfUnset('flavor_id', 'flavor_id');

      if (template.floating_ip_enabled !== null) {
        $scope.model.floating_ip_enabled = template.floating_ip_enabled;
      }

      if (!template.labels) { return; }

      $scope.model.templateLabels = template.labels;

      // If a template label exists as a field on the form -> Set it as a default
      setLabelResponseAsDefault('auto_scaling_enabled', 'auto_scaling_enabled', true);
      setLabelResponseAsDefault('auto_healing_enabled', 'auto_healing_enabled', true);

      // Set default `ingress_controller` based on its label
      if (template.labels.ingress_controller !== null &&
        $scope.model.ingressControllers && $scope.model.ingressControllers.length > 0) {
        $scope.model.ingress_controller = MODEL_DEFAULTS.ingress_controller;
        $scope.model.ingressControllers.forEach(function(controller) {
          if (controller.labels && controller.labels.ingress_controller &&
            controller.labels.ingress_controller === template.labels.ingress_controller) {
            $scope.model.ingress_controller = controller;
          }
        });
      }

      function setResponseAsDefaultIfUnset(responseKey, modelKey) {
        if ($scope.model[modelKey] === MODEL_DEFAULTS[modelKey] &&
          template[responseKey] !== null) {
          $scope.model[modelKey] = template[responseKey];
        }
      }
      function setLabelResponseAsDefault(labelKey, modelKey, isValueBoolean) {
        if (template.labels[labelKey] !== null) {
          $scope.model[modelKey] = isValueBoolean
            ? template.labels[labelKey] === 'true'
            : template.labels[labelKey];
        }
      }
    }

    function watchClusterTemplateId() {
      return $scope.model.cluster_template_id;
    }

    var clusterTemplateWatcher = $scope.$watch(
      watchClusterTemplateId, loadClusterTemplate, true
    );

    $scope.$on('$destroy', function() {
      clusterTemplateWatcher();
    });
  }
})();
