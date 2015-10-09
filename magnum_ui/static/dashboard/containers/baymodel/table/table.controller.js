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
   * @name containersBayModelTableController
   * @ngController
   *
   * @description
   * Controller for the containers bay model table
   */
  angular
    .module('horizon.dashboard.containers.baymodel')
    .controller('containersBayModelTableController', containersBayModelTableController);

  containersBayModelTableController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function containersBayModelTableController($scope, magnum) {
    var ctrl = this;
    ctrl.ibaymodels = [];
    ctrl.baymodels = [];

    ctrl.singleDelete = singleDelete;
    ctrl.batchDelete = batchDelete;

    init();

    function init() {
      magnum.getBayModels().success(getBayModelsSuccess);
    }

    function getBayModelsSuccess(response) {
      ctrl.baymodels = response.items;
    }

    function singleDelete(baymodel) {
      magnum.deleteBayModel(baymodel.id).success(function() {
        ctrl.baymodels.splice(ctrl.baymodels.indexOf(baymodel),1);
      });
    }

    function batchDelete() {
      var ids = [];
      for (var id in $scope.selected) {
        if ($scope.selected[id].checked) {
          ids.push(id);
        }
      }
      magnum.deleteBayModels(ids).success(function() {
        for (var id in ids) {
          var todelete = ctrl.baymodels.filter(function(obj) {
            return obj.id == ids[id];
          });
          ctrl.baymodels.splice(ctrl.baymodels.indexOf(todelete[0]),1);
        }
        $scope.selected = {};
      })
    }
  }

})();
