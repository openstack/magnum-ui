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
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function containersContainersTableController($scope, magnum) {
    var ctrl = this;
    ctrl.icontainers = [];
    ctrl.containers = [];

    ctrl.singleDelete = singleDelete;
    ctrl.batchDelete = batchDelete;

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

    init();

    function init() {
      magnum.getContainers().success(getContainersSuccess);
    }

    function getContainersSuccess(response) {
      ctrl.containers = response.items;
    }

    function singleDelete(container) {
      magnum.deleteContainer(container.id).success(function() {
        ctrl.containers.splice(ctrl.containers.indexOf(container), 1);
      });
    }

    function batchDelete() {
      var ids = [];
      for (var id in $scope.selected) {
        if ($scope.selected[id].checked) {
          ids.push(id);
        }
      }
      magnum.deleteContainers(ids).success(function() {
        for (var c in ids) {
          var todelete = ctrl.containers.filter(function(obj) {
            return obj.id == ids[c];
          });
          ctrl.containers.splice(ctrl.containers.indexOf(todelete[0]), 1);
        }
        $scope.selected = {};
      });
    }
  }

})();
