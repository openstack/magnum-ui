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
   * @name createBayModelInfoController
   * @ngController
   *
   * @description
   * Controller for the bay model info step in create workflow
   */
  angular
    .module('horizon.dashboard.containers.baymodels')
    .controller('createBayModelInfoController', createBayModelInfoController);

  createBayModelInfoController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.containers.basePath',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function createBayModelInfoController($q, $scope, basePath, magnum) {
    var ctrl = this;
    ctrl.coes = [{name: "", label: gettext("Choose a Container Orchestration Engine")},
                 {name: "swarm", label: gettext("Docker Swarm")},
                 {name: "kubernetes", label: gettext("Kubernetes")},
                 {name: "mesos", label: gettext("Mesos")}];
    /* default is first value */
    ctrl.supportedDrivers = {
      kubernetes: [{name:"flannel", label: gettext("Flannel")}],
      swarm: [{name:"docker", label: gettext("Docker")},
              {name:"flannel", label: gettext("Flannel")}],
      mesos: [{name:"docker", label: gettext("Docker")}]};

    $scope.changeCoes = function(){
      $scope.model.newBayModelSpec.network_drivers = ctrl.supportedDrivers[$scope.model.newBayModelSpec.coe];
      $scope.model.newBayModelSpec.network_driver = ctrl.supportedDrivers[$scope.model.newBayModelSpec.coe][0].name;
    };
  }

})();
