/**
 * Copyright 2015 Cisco Systems, Inc.
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
   * @ngdoc overview
   * @name containersContainersTableController
   * @ngController
   *
   * @description
   * Controller for the Magnum containers table
   */
  angular
    .module('horizon.dashboard.containers.containers')
    .controller('containersContainersTableController', containersContainersTableController);

  containersContainersTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.containers.containers.events',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.containers.containers.resourceType'
  ];

  function containersContainersTableController($scope, magnum, events, registry, containerResourceType) {
    var ctrl = this;
    ctrl.containers = [];
    ctrl.containersSrc = [];
    ctrl.containerResource = registry.getResourceType(containerResourceType);


    /**
     * Filtering - client-side MagicSearch
     * all facets for container table
     */
    ctrl.containerFacets = [
      {
        'label': gettext('Name'),
        'name': 'name',
        'singleton': true
      },
      {
        'label': gettext('UUID'),
        'name': 'id',
        'singleton': true
      },
      {
        'label': gettext('Status'),
        'name': 'status',
        'singleton': true
      },
      {
        'label': gettext('Bay'),
        'name': 'bay-uuid',
        'singleton': true
      },
      {
        'label': gettext('Image'),
        'name': 'image',
        'singleton': true
      },
      {
        'label': gettext('Memory'),
        'name': 'memory',
        'singleton': true
      },
      {
        'label': gettext('Command'),
        'name': 'command',
        'singleton': true
      }
    ];

    var createWatcher = $scope.$on(events.CREATE_SUCCESS, onCreateSuccess);
    var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);

    $scope.$on('$destroy', destroy);

    init();

    function init() {
      registry.initActions(containerResourceType, $scope);
      magnum.getContainers().success(getContainersSuccess);
    }

    function getContainersSuccess(response) {
      ctrl.containersSrc = response.items;
    }


    function onCreateSuccess(e, createdItem) {
      ctrl.containersSrc.push(createdItem);
      e.stopPropagation();
    }

    function onDeleteSuccess(e, removedIds) {
      ctrl.containersSrc = difference(ctrl.containersSrc, removedIds, 'id');
      e.stopPropagation();

      // after deleting the items
      // we need to clear selected items from table controller
      $scope.$emit('hzTable:clearSelected');
    }

    function difference(currentList, otherList, key) {
      return currentList.filter(filter);

      function filter(elem) {
        return otherList.filter(function filterDeletedItem(deletedItem) {
          return deletedItem === elem[key];
        }).length === 0;
      }
    }

    function destroy() {
      createWatcher();
      deleteWatcher();
    }
  }

})();
