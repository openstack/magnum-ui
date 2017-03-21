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

  angular.module('horizon.dashboard.container-infra.cluster-templates')
    .factory('horizon.dashboard.container-infra.cluster-templates.service',
      clusterTemplatesService);

  clusterTemplatesService.$inject = [
    '$filter',
    'horizon.app.core.detailRoute',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  /*
   * @ngdoc factory
   * @name horizon.dashboard.container-infra.cluster-templates.service
   *
   * @description
   * This service provides functions that are used through the Cluster Templates
   * features.  These are primarily used in the module registrations
   * but do not need to be restricted to such use.  Each exposed function
   * is documented below.
   */
  function clusterTemplatesService($filter, detailRoute, magnum) {
    return {
      getClusterTemplatesPromise: getClusterTemplatesPromise,
      urlFunction: urlFunction
    };

    function getClusterTemplatesPromise(params) {
      return magnum.getClusterTemplates(params).then(modifyResponse);

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(addTrackBy)}};

        function addTrackBy(clusterTemplate) {
          /* eslint-disable max-len */
          var timestamp = clusterTemplate.updated_at ? clusterTemplate.updated_at : clusterTemplate.created_at;
          clusterTemplate.trackBy = clusterTemplate.id + timestamp;
          return clusterTemplate;
        }
      }
    }

    function urlFunction(item) {
      return detailRoute + 'OS::Magnum::ClusterTemplate/' + item.id;
    }
  }
})();
