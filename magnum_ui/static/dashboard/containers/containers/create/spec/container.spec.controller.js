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
   * @name createContainerSpecController
   * @ngController
   *
   * @description
   * Controller for the container spec step in create workflow
   */
  angular
    .module('horizon.dashboard.containers.containers')
    .controller('createContainerSpecController', createContainerSpecController);

  createContainerSpecController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.containers.basePath',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function createContainerSpecController($q, $scope, basePath, magnum) {
    var ctrl = this;
    ctrl.memory_units = [{unit: "b", label: gettext("bytes")},
                        {unit: "k", label: gettext("KB")},
                        {unit: "m", label: gettext("MB")},
                        {unit: "g", label: gettext("GB")}];

    $scope.changeMemory = function(){
      if($scope.model.newContainerSpec.memory_size > 0){
        $scope.model.newContainerSpec.memory = $scope.model.newContainerSpec.memory_size + $scope.model.newContainerSpec.memory_unit;
      }else{
        $scope.model.newContainerSpec.memory = null;
      }
    };
    $scope.changeMemoryUnit = function(){
      $scope.changeMemory();
    };
    $scope.changeMemorySize = function(){
      $scope.changeMemory();
    };
  }

})();
