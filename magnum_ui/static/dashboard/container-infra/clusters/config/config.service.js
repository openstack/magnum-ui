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
   * @name horizon.dashboard.container-infra.clusters.config.service
   * @description Service for the container-infra cluster get config modal
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.config.service',
      getClusterConfigService);

  getClusterConfigService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.file.text-download',
    'horizon.framework.util.q.extensions'
  ];

  function getClusterConfigService(
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
      // get config
      return magnum.getClusterConfig(selected.id).then(function(response) {
        if ( response.data.key !== undefined ) {
          textDownload.downloadTextFile(response.data.key, selected.name + "_key.pem");
          textDownload.downloadTextFile(response.data.ca, selected.name + "_ca.pem");
          textDownload.downloadTextFile(response.data.cert, selected.name + "_cert.pem");
        }
        textDownload.downloadTextFile(response.data.cluster_config, selected.name + "_config");
        var result = actionResult.getActionResult()
                     .created(resourceType, selected.id);
        return result.result;
      });
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }
  }
})();
