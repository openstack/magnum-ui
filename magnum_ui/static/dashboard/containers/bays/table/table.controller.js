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
   * @name containersBaysTableController
   * @ngController
   *
   * @description
   * Controller for the containers bay table
   */
  angular
    .module('horizon.dashboard.containers.bays')
    .controller('containersBaysTableController', containersBaysTableController);

  containersBaysTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.containers.bays.events',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.containers.bays.resourceType'
  ];

  function containersBaysTableController($scope, magnum, events, registry, bayResourceType) {
    var ctrl = this;
    ctrl.bays = [];
    ctrl.baysSrc = [];
    ctrl.bayResource = registry.getResourceType(bayResourceType);

    /**
     * Filtering - client-side MagicSearch
     * all facets for bay table
     */
    ctrl.bayFacets = [
      {
        'label': gettext('Name'),
        'name': 'name',
        'singleton': true
      },
      {
        'label': gettext('ID'),
        'name': 'id',
        'singleton': true
      },
      {
        'label': gettext('Status'),
        'name': 'status',
        'singleton': true
      },
      {
        'label': gettext('Master Count'),
        'name': 'master_count',
        'singleton': true
      },
      {
        'label': gettext('Node Count'),
        'name': 'node_count',
        'singleton': true
      }
    ];

    var createWatcher = $scope.$on(events.CREATE_SUCCESS, onCreateSuccess);
    var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);

    $scope.$on('$destroy', destroy);

    init();

    function init() {
      registry.initActions(bayResourceType, $scope);
      magnum.getBays().success(getBaysSuccess);
    }

    function getBaysSuccess(response) {
      ctrl.baysSrc = response.items;
    }

    function onCreateSuccess(e, createdItem) {
      ctrl.baysSrc.push(createdItem);
      e.stopPropagation();
    }

    function onDeleteSuccess(e, removedIds) {
      ctrl.baysSrc = difference(ctrl.baysSrc, removedIds, 'id');
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
