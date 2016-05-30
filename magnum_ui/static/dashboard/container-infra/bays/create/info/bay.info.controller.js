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
   * @name createBayInfoController
   * @ngController
   *
   * @description
   * Controller for the container-infra bay info step in create workflow
   */
  angular
    .module('horizon.dashboard.container-infra.bays')
    .controller('createBayInfoController', createBayInfoController);

  createBayInfoController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function createBayInfoController($q, $scope, basePath, magnum) {
    var ctrl = this;
    ctrl.baymodels = [{id:"", name: gettext("Choose a Baymodel")}];
    $scope.model.newBaySpec.baymodel_id = "";
    $scope.baymodeldetail = {
        name: "",
        id: "",
        coe: "",
        image_id: "",
        public: "",
        registry_enabled: "",
        tls_disabled: "",
        apiserver_port: ""
    };

    $scope.changeBaymodel = function(){
      angular.forEach(ctrl.baymodels, function(model, idx){
        if($scope.model.newBaySpec.baymodel_id === model.id){
          $scope.baymodeldetail.name = model.name;
          $scope.baymodeldetail.id = model.id;
          $scope.baymodeldetail.coe = model.coe;
          $scope.baymodeldetail.image_id = model.image_id;
          $scope.baymodeldetail.public = model.public;
          $scope.baymodeldetail.registry_enabled = model.registry_enabled;
          $scope.baymodeldetail.tls_disabled = model.tls_disabled;
          $scope.baymodeldetail.apiserver_port = model.apiserver_port;
        }
      });
    };

    init();

    function init() {
      magnum.getBaymodels({paginate: false}).success(onGetBaymodels);
    }

    function onGetBaymodels(response) {
      Array.prototype.push.apply(ctrl.baymodels, response.items);
      if($scope.selected instanceof Object){
        $scope.model.newBaySpec.baymodel_id = $scope.selected.id;
        $scope.changeBaymodel();
      }
    }

  }

})();
