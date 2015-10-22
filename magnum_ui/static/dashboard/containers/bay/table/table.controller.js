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
   * @name containersBayTableController
   * @ngController
   *
   * @description
   * Controller for the containers bay table
   */
  angular
    .module('horizon.dashboard.containers.bay')
    .controller('containersBayTableController', containersBayTableController);

  containersBayTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function containersBayTableController($scope, magnum) {
    var ctrl = this;
    ctrl.ibays = [];
    ctrl.bays = [];

    ctrl.singleDelete = singleDelete;
    ctrl.batchDelete = batchDelete;

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


    init();

    function init() {
      magnum.getBays().success(getBaysSuccess);
    }

    function getBaysSuccess(response) {
      ctrl.bays = response.items;
    }

    function singleDelete(bay) {
      magnum.deleteBay(bay.id).success(function() {
        ctrl.bays.splice(ctrl.bays.indexOf(bay), 1);
      });
    }

    function batchDelete() {
      var ids = [];
      for (var id in $scope.selected) {
        if ($scope.selected[id].checked) {
          ids.push(id);
        }
      }
      magnum.deleteBays(ids).success(function() {
        for (var b in ids) {
          var todelete = ctrl.bays.filter(function(obj) {
            return obj.id == ids[b];
          });
          ctrl.bays.splice(ctrl.bays.indexOf(todelete[0]), 1);
        }
        $scope.selected = {};
      });
    }
  }

})();
