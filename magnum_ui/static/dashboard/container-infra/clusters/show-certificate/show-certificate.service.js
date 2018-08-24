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

  /**
   * @ngdoc overview
   * @name horizon.dashboard.container-infra.clusters.show-certificate.service
   * @description Service for the container-infra cluster show certificate modal
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.show-certificate.service',
      showCertificateService);

  showCertificateService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.file.text-download',
    'horizon.framework.util.q.extensions'
  ];

  function showCertificateService(
    magnum, resourceType, actionResult, textDownload, $qExtensions
  ) {

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initAction() {
    }

    function perform(selected) {
      // get certificate
      return magnum.showCertificate(selected.id).then(function(response) {
        textDownload.downloadTextFile(response.data.pem, selected.name + "_ca.pem");

        response.data.id = response.data.uuid;
        var result = actionResult.getActionResult()
                     .created(resourceType, response.data.id);
        return result.result;
      });
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }
  }
})();
