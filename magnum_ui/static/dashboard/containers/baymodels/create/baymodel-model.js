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
    .module('horizon.dashboard.containers.baymodels')
    .factory('baymodelModel', baymodelModel);

  baymodelModel.$inject = [
    'horizon.dashboard.containers.baymodels.events',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function baymodelModel(events, magnum) {
    var model = {
      newBayModelSpec: {},

      // API methods
      init: init,
      createBayModel: createBayModel
    };

    function initNewBayModelSpec() {
      model.newBayModelSpec = {
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
        ssh_authorized_key: null,
        network_driver: "",
        http_proxy: null,
        https_proxy: null,
        no_proxy: null,
        external_network_id: "",
        fixed_network: "",
        dns_nameserver: null,
        labels: null,
        network_drivers : [{name: "docker", label: gettext("Docker")},
                           {name: "flannel", label: gettext("Flannel")}]
      };
    }

    function init() {
      // Reset the new BayModel spec
      initNewBayModelSpec();
    }

    function createBayModel() {
      var finalSpec = angular.copy(model.newBayModelSpec);

      cleanNullProperties(finalSpec);

      return magnum.createBayModel(finalSpec);
    }

    function cleanNullProperties(finalSpec) {
      // Initially clean fields that don't have any value.
      // Not only "null", blank too.
      // "network_drivers" is used for pull-down options. not for submittion.
      for (var key in finalSpec) {
        if (finalSpec.hasOwnProperty(key) && finalSpec[key] === null || finalSpec[key] === "" || key === "network_drivers") {
          delete finalSpec[key];
        }
      }
    }

    return model;
  }
})();
