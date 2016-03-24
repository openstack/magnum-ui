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
    .module('horizon.dashboard.containers.containers')
    .factory('horizon.dashboard.containers.containers.containerModel', containerModel);

  containerModel.$inject = [
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function containerModel(magnum) {
    var model = {
      newContainerSpec: {},

      // API methods
      init: init,
      createContainer: createContainer
    };

    function initNewContainerSpec() {
      model.newContainerSpec = {
        name: null,
        bay_uuid: null,
        image: null,
        memory: null,
        memory_size: null,
        memory_unit: "m",
        command: null
      };
    }

    function init() {
      // Reset the new Bay spec
      initNewContainerSpec();
    }

    function createContainer() {
      var finalSpec = angular.copy(model.newContainerSpec);

      cleanNullProperties(finalSpec);

      return magnum.createContainer(finalSpec);
    }

    function cleanNullProperties(finalSpec) {
      // Initially clean fields that don't have any value.
      for (var key in finalSpec) {
        if (finalSpec.hasOwnProperty(key) && finalSpec[key] === null
            || key === "memory_size" || key === "memory_unit") {
          delete finalSpec[key];
        }
      }
    }

    return model;
  }
})();
