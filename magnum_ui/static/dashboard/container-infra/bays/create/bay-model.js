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

  angular
    .module('horizon.dashboard.container-infra.bays')
    .factory('horizon.dashboard.container-infra.bays.bayModel', bayModel);

  bayModel.$inject = [
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function bayModel(magnum) {
    var model = {
      newBaySpec: {},

      // API methods
      init: init,
      createBay: createBay
    };

    function initNewBaySpec() {
      model.newBaySpec = {
        name: null,
        baymodel_id: null,
        master_count: null,
        node_count: null,
        discover_url: null,
        bay_create_timeout: null
      };
    }

    function init() {
      // Reset the new Bay spec
      initNewBaySpec();
    }

    function createBay() {
      var finalSpec = angular.copy(model.newBaySpec);

      cleanNullProperties(finalSpec);

      return magnum.createBay(finalSpec);
    }

    function cleanNullProperties(finalSpec) {
      // Initially clean fields that don't have any value.
      for (var key in finalSpec) {
        if (finalSpec.hasOwnProperty(key) && finalSpec[key] === null) {
          delete finalSpec[key];
        }
      }
    }

    return model;
  }
})();
