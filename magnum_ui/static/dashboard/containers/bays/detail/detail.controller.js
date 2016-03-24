/*
 * Copyright 2015 NEC Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular
    .module('horizon.dashboard.containers.bays')
    .controller('BayDetailController', BayDetailController);

  BayDetailController.$inject = [
    '$scope',
    '$window',
    '$location',
    '$routeParams',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.containers.bays.events',
    'horizon.dashboard.containers.containers.events',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.containers.bays.resourceType'
  ];

  function BayDetailController(
    $scope, $window, $location, $routeParams, magnum, events, containerEvents, registry, bayResourceType
  ) {
    var ctrl = this;
    ctrl.bay = {};
    ctrl.baymodel = {};
    ctrl.bayResource = registry.getResourceType(bayResourceType);

    var bayId = $routeParams.bayId;

    var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);
    var createContainerWatcher = $scope.$on(containerEvents.CREATE_SUCCESS, onCreateContainerSuccess);

    $scope.$on('$destroy', destroy);

    init();

    function init() {
      registry.initActions(bayResourceType, $scope);
      // Load the elements that are used in the overview.
      magnum.getBay(bayId).success(onGetBay);
    }

    function onGetBay(bay) {
      ctrl.bay = bay;
      ctrl.bay.id = bay.uuid;
      magnum.getBaymodel(ctrl.bay.baymodel_id).success(onGetBaymodel);
    }

    function onGetBaymodel(baymodel) {
      ctrl.baymodel = baymodel;
    }

    function onDeleteSuccess(e, removedIds) {
      e.stopPropagation();
      $location.path("/project/bays");
    }

    function onCreateContainerSuccess(e, createdItem) {
      e.stopPropagation();
      $location.path("/project/bays/containers");
    }

    function destroy() {
      deleteWatcher();
      createContainerWatcher();
    }
  }
})();