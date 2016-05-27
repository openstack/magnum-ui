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
    .module('horizon.dashboard.container-infra.baymodels')
    .factory('baymodelModel', baymodelModel);

  baymodelModel.$inject = [
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function baymodelModel(magnum) {
    var model = {
      newBaymodelSpec: {},

      // API methods
      init: init,
      createBaymodel: createBaymodel
    };

    function initNewBaymodelSpec() {
      model.newBaymodelSpec = {
        name: null,
        coe: "",
        public: null,
        registry_enabled: null,
        tls_disabled: null,
        image_id: "",
        flavor_id: "",
        master_flavor_id: "",
        docker_volume_size: null,
        keypair_id: "",
        network_driver: "",
        volume_driver: "",
        http_proxy: null,
        https_proxy: null,
        no_proxy: null,
        external_network_id: "",
        fixed_network: "",
        dns_nameserver: null,
        labels: null,
        network_drivers : [{name: "docker", label: gettext("Docker")},
                           {name: "flannel", label: gettext("Flannel")}],
        volume_drivers : [{name: "", label: gettext("Choose a Volume Driver")},
                          {name: "cinder", label: gettext("Cinder")},
                          {name: "rexray", label: gettext("Rexray")}]
      };
    }

    function init() {
      // Reset the new Baymodel spec
      initNewBaymodelSpec();
    }

    function createBaymodel() {
      var finalSpec = angular.copy(model.newBaymodelSpec);

      cleanNullProperties(finalSpec);

      return magnum.createBaymodel(finalSpec);
    }

    function cleanNullProperties(finalSpec) {
      // Initially clean fields that don't have any value.
      // Not only "null", blank too.
      // "network_drivers" and "volume_drivers" are used for pull-down options.
      // These are not for submittion.
      for (var key in finalSpec) {
        if (finalSpec.hasOwnProperty(key) && finalSpec[key] === null || finalSpec[key] === ""
            || key === "network_drivers" || key === "volume_drivers") {
          delete finalSpec[key];
        }
      }
    }

    return model;
  }
})();
