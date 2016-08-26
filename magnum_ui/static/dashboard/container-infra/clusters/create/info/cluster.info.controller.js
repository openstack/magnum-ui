/**
 * Copyright 2015 NEC Corporation
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
   * @ngdoc controller
   * @name createClusterInfoController
   * @ngController
   *
   * @description
   * Controller for the container-infra cluster info step in create workflow
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller('createClusterInfoController', createClusterInfoController);

  createClusterInfoController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function createClusterInfoController($q, $scope, basePath, magnum) {
    var ctrl = this;
    ctrl.cluster_templates = [{id:"", name: gettext("Choose a Cluster Template")}];
    $scope.model.newClusterSpec.baymodel_id = "";
    $scope.cluster_template_detail = {
        name: "",
        id: "",
        coe: "",
        image_id: "",
        public: "",
        registry_enabled: "",
        tls_disabled: "",
        apiserver_port: ""
    };

    $scope.changeClusterTemplate = function(){
      angular.forEach(ctrl.cluster_templates, function(model, idx){
        if($scope.model.newClusterSpec.baymodel_id === model.id){
          $scope.cluster_template_detail.name = model.name;
          $scope.cluster_template_detail.id = model.id;
          $scope.cluster_template_detail.coe = model.coe;
          $scope.cluster_template_detail.image_id = model.image_id;
          $scope.cluster_template_detail.public = model.public;
          $scope.cluster_template_detail.registry_enabled = model.registry_enabled;
          $scope.cluster_template_detail.tls_disabled = model.tls_disabled;
          $scope.cluster_template_detail.apiserver_port = model.apiserver_port;
        }
      });
    };

    init();

    function init() {
      magnum.getClusterTemplates({paginate: false}).success(onGetClusterTemplates);
    }

    function onGetClusterTemplates(response) {
      Array.prototype.push.apply(ctrl.cluster_templates, response.items);
      if($scope.selected instanceof Object){
        $scope.model.newClusterSpec.baymodel_id = $scope.selected.id;
        $scope.changeClusterTemplate();
      }
    }

  }

})();
