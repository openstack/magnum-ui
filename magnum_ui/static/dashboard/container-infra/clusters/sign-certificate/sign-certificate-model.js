/**
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
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.sign-certificate-model', CertificateModel);

  CertificateModel.$inject = [
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function CertificateModel(magnum) {
    var model = {
      newCertificateSpec: {},
      cluster_name: "",

      // API methods
      init: init,
      signCertificate: signCertificate
    };

    function init(clusterId) {
      // Reset the new Certificate spec
      model.newCertificateSpec = {
        cluster_uuid: clusterId,
        csr: ""
      };
      model.cluster_name = "";
    }

    function signCertificate() {
      var finalSpec = angular.copy(model.newCertificateSpec);

      cleanNullProperties(finalSpec);

      return magnum.signCertificate(finalSpec);
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
