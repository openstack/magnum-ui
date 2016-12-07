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
   * @name createClusterMiscController
   * @ngController
   *
   * @description
   * Controller for the container-infra cluster misc step in create workflow
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller('createClusterMiscController', createClusterMiscController);

  createClusterMiscController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.nova'
  ];

  function createClusterMiscController($scope, nova) {
    var ctrl = this;
    ctrl.keypairs = [{id:null, name: gettext("Choose a Keypair")}];
    $scope.model.newClusterSpec.keypair = null;

    init();

    function init() {
      nova.getKeypairs().success(onGetKeypairs);
    }

    function onGetKeypairs(response) {
      angular.forEach(response.items, function(item) {
        ctrl.keypairs.push({id: item.keypair.name, name: item.keypair.name});
      });
    }

    function getKeypair() {
      return $scope.model.templateKeypair;
    }

    function toggleKeypairRequirement(newValue) {
      ctrl.templateKeypair = newValue;
    }
    var keypairWatcher = $scope.$watch(getKeypair, toggleKeypairRequirement, true);
    $scope.$on('$destroy', function() {
      keypairWatcher();
    });
  }
})();
