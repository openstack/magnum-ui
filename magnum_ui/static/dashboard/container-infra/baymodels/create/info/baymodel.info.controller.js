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
   * @name createBaymodelInfoController
   * @ngController
   *
   * @description
   * Controller for the bay model info step in create workflow
   */
  angular
    .module('horizon.dashboard.container-infra.baymodels')
    .controller('createBaymodelInfoController', createBaymodelInfoController);

  createBaymodelInfoController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.framework.util.i18n.gettext'
  ];

  function createBaymodelInfoController($q, $scope, basePath, magnum, gettext) {
    var ctrl = this;
    ctrl.coes = [{name: "", label: gettext("Choose a Container Orchestration Engine")},
                 {name: "swarm", label: gettext("Docker Swarm")},
                 {name: "kubernetes", label: gettext("Kubernetes")},
                 {name: "mesos", label: gettext("Mesos")}];
    /* default is first value */
    ctrl.supportedNetworkDrivers = {
      initial: [{name:"", label: gettext("Choose a Network Driver")},
                {name: "docker", label: gettext("Docker")},
                {name: "flannel", label: gettext("Flannel")}],
      kubernetes: [{name:"flannel", label: gettext("Flannel")}],
      swarm: [{name:"docker", label: gettext("Docker")},
              {name:"flannel", label: gettext("Flannel")}],
      mesos: [{name:"docker", label: gettext("Docker")}]};
    ctrl.supportedVolumeDrivers = {
      initial: [{name:"", label: gettext("Choose a Volume Driver")},
                {name: "cinder", label: gettext("Cinder")},
                {name: "rexray", label: gettext("Rexray")}],
      kubernetes: [{name:"", label: gettext("Choose a Volume Driver")},
                   {name:"cinder", label: gettext("Cinder")}],
      swarm: [{name:"", label: gettext("Choose a Volume Driver")},
              {name:"rexray", label: gettext("Rexray")}],
      mesos: [{name:"", label: gettext("Choose a Volume Driver")},
              {name:"rexray", label: gettext("Rexray")}]};

    $scope.changeCoes = function(){
      if($scope.model.newBaymodelSpec.coe){
        $scope.model.newBaymodelSpec.network_drivers = ctrl.supportedNetworkDrivers[$scope.model.newBaymodelSpec.coe];
        $scope.model.newBaymodelSpec.network_driver = ctrl.supportedNetworkDrivers[$scope.model.newBaymodelSpec.coe][0].name;
        $scope.model.newBaymodelSpec.volume_drivers = ctrl.supportedVolumeDrivers[$scope.model.newBaymodelSpec.coe];
        $scope.model.newBaymodelSpec.volume_driver = ctrl.supportedVolumeDrivers[$scope.model.newBaymodelSpec.coe][0].name;
      }else{
        $scope.model.newBaymodelSpec.network_drivers = ctrl.supportedNetworkDrivers.initial;
        $scope.model.newBaymodelSpec.network_driver = ctrl.supportedNetworkDrivers.initial[0].name;
        $scope.model.newBaymodelSpec.volume_drivers = ctrl.supportedVolumeDrivers.initial;
        $scope.model.newBaymodelSpec.volume_driver = ctrl.supportedVolumeDrivers.initial[0].name;
      }
    };
  }

})();
