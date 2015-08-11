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
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function containersBayModelTableController(magnum) {
    var ctrl = this;
    ctrl.ibaymodels = [];
    ctrl.baymodels = [];
    ctrl.checked = {};

    ctrl.singleDelete = singleDelete;
    ctrl.batchDelete = batchDelete;

    init();

    function init() {
      magnum.getBayModels().success(getBayModelsSuccess);
    }

    function getBayModelsSuccess(response) {
      ctrl.baymodels = response.baymodels;
    }

    function singleDelete(baymodel) {
      magnum.deleteBayModel(baymodel.uuid).success(function() {
        ctrl.baymodels.splice(ctrl.baymodels.indexOf(baymodel),1);
      });
    }

    function batchDelete() {
      var ids = [];
      for (var bm in ctrl.checked) {
        ids.push(bm);
      }

      magnum.deleteBayModels(ctrl.checked).success(function() {
        for (var bm in ctrl.checked) {
          var todelete = ctrl.baymodels.filter(function(obj) {
            return obj.uuid == bm;
          });
          ctrl.baymodels.splice(ctrl.baymodels.indexOf(todelete[0]),1);
        }
        ctrl.checked = {};
      })
    }
  }

})();
