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
    .module('horizon.dashboard.containers.containers')
    .controller('ContainerDetailController', ContainerDetailController);

  ContainerDetailController.$inject = [
    '$scope',
    '$window',
    '$location',
    '$routeParams',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.containers.containers.events',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.containers.containers.resourceType'
  ];

  function ContainerDetailController($scope, $window, $location, $routeParams, magnum, events, registry, containerResourceType) {
    var ctrl = this;
    ctrl.container = {};
    ctrl.bay = {};
    ctrl.baymodel = {};
    ctrl.containerResource = registry.getResourceType(containerResourceType);

    var containerId = $routeParams.containerId;

    var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);

    $scope.$on('$destroy', destroy);

    init();

    function init() {
      registry.initActions(containerResourceType, $scope);
      // Load the elements that are used in the overview.
      magnum.getContainer(containerId).success(onGetContainer);
    }

    function onGetContainer(container) {
      ctrl.container = container;
      ctrl.container.id = container.uuid;
      magnum.getBay(ctrl.container.bay_uuid).success(onGetBay);
    }

    function onGetBay(bay) {
      ctrl.bay = bay;
      magnum.getBayModel(ctrl.bay.baymodel_id).success(onGetBayModel);
    }

    function onGetBayModel(baymodel) {
      ctrl.baymodel = baymodel;
    }

    function onDeleteSuccess(e, removedIds) {
      e.stopPropagation();
      $location.path("/project/bays/containers");
    }

    function destroy() {
      deleteWatcher();
    }
  }
})();