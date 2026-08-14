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
   * @description Service for downloading a container-infra cluster config
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.config.service',
      getClusterConfigService);

  getClusterConfigService.$inject = [
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.q.extensions',
    '$window'
  ];

  function getClusterConfigService(
    resourceType, actionResult, $qExtensions, $window
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
      var url = '/api/container_infra/clusters/' + encodeURIComponent(selected.id) +
        '/config/download';
      $window.location.assign(url);
      return actionResult.getActionResult()
        .created(resourceType, selected.id)
        .result;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }
  }
})();
