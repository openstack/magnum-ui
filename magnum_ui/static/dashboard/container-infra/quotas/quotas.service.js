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
  "use strict";

  angular.module('horizon.dashboard.container-infra.quotas')
    .factory('horizon.dashboard.container-infra.quotas.service',
      quotasService);

  quotasService.$inject = [
    '$filter',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  /*
   * @ngdoc factory
   * @name horizon.dashboard.container-infra.quotas.service
   *
   * @description
   * This service provides functions that are used through the Quotas
   * features.  These are primarily used in the module registrations
   * but do not need to be restricted to such use.  Each exposed function
   * is documented below.
   */
  function quotasService($filter, magnum) {
    return {
      getQuotasPromise: getQuotasPromise
    };

    function getQuotasPromise(params) {
      return magnum.getQuotas(params).then(modifyResponse);

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(addTrackBy)}};

        function addTrackBy(quota) {
          quota.trackBy = quota.id + quota.resource;
          return quota;
        }
      }
    }
  }
})();
