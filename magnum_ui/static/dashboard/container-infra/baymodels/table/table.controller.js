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
   * @name BaymodelsTableController
   * @ngController
   *
   * @description
   * Controller for the container-infra bay model table
   */
  angular
    .module('horizon.dashboard.container-infra.baymodels')
    .controller('BaymodelsTableController', BaymodelsTableController);

  BaymodelsTableController.$inject = [
    '$scope',
    '$location',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.baymodels.events',
    'horizon.dashboard.container-infra.bays.events',
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.container-infra.baymodels.resourceType'
  ];

  function BaymodelsTableController($scope, $location, magnum, events, bayEvents, registry, baymodelResourceType) {
    var ctrl = this;
    ctrl.baymodels = [];
    ctrl.baymodelsSrc = [];
    ctrl.baymodelResource = registry.getResourceType(baymodelResourceType);

    /**
     * Filtering - client-side MagicSearch
     * all facets for baymodel table
     */
    ctrl.baymodelFacets = [
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
        'label': gettext('COE'),
        'name': 'coe',
        'singleton': true
      }
    ];

    var createWatcher = $scope.$on(events.CREATE_SUCCESS, onCreateSuccess);
    var createBayWatcher = $scope.$on(bayEvents.CREATE_SUCCESS, onCreateBaySuccess);
    var deleteWatcher = $scope.$on(events.DELETE_SUCCESS, onDeleteSuccess);

    $scope.$on('$destroy', destroy);

    init();

    function init() {
      registry.initActions(baymodelResourceType, $scope);
      magnum.getBaymodels().success(getBaymodelsSuccess);
    }

    function getBaymodelsSuccess(response) {
      ctrl.baymodelsSrc = response.items;
    }

    function onCreateSuccess(e, createdItem) {
      e.stopPropagation();
      ctrl.baymodelsSrc.push(createdItem);
    }

    function onCreateBaySuccess(e, createdItem) {
      e.stopPropagation();
      $location.path("/project/bays");
    }

    function onDeleteSuccess(e, removedIds) {
      ctrl.baymodelsSrc = difference(ctrl.baymodelsSrc, removedIds, 'id');
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
