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
   * Controller for the containers bay info step in create workflow
   */
  angular
    .module('horizon.dashboard.containers.bay')
    .controller('createBayInfoController', createBayInfoController);

  createBayInfoController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.containers.basePath',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function createBayInfoController($q, $scope, basePath, magnum) {
    var ctrl = this;
    ctrl.baymodels = [{id:"", name: "Choose a Bay Model"}];
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

    $scope.changeBayModel = function(){
      // show Bay Model Detail
      if(!$scope.model.newBaySpec.baymodel_id){
        $("#baymodel_detail").hide();
        $("#baymodel_detail_none").show();
      } else {
        angular.forEach(ctrl.baymodels, function(model, idx){
          if($scope.model.newBaySpec.baymodel_id === model.id){
            $("#baymodel_detail").show();
            $("#baymodel_detail_none").hide();
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
      }
    };

    init();
    $("#baymodel_detail").hide();
    $("#baymodel_detail_none").show();

    function init() {
      magnum.getBayModels({paginate: false}).success(onGetBayModels);
    }

    function onGetBayModels(response) {
      Array.prototype.push.apply(ctrl.baymodels, response.items);
    }

  }

})();
