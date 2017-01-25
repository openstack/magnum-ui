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
        keypair_id: ""
      };
    }

    loadClusterTemplate($scope.model.cluster_template_id);

    function loadClusterTemplate(id, old) {
      if (id !== old) {
        if (id === '') {
          $scope.model.keypair = "";
        } else {
          magnum.getClusterTemplate(id).then(onGetClusterTemplate);
        }
      }
    }

    function onGetClusterTemplate(response) {
      ctrl.clusterTemplate = response.data;
      if ($scope.model.keypair === "") {
        $scope.model.keypair = response.data.keypair_id;
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
