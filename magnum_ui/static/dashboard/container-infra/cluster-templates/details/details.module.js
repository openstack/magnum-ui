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
   * @ngname horizon.dashboard.container-infra.cluster-templates.details
   *
   * @description
   * Provides details features for cluster templates.
   */
  angular.module('horizon.dashboard.container-infra.cluster-templates.details',
                 ['horizon.framework.conf', 'horizon.app.core'])
  .run(registerClusterTemplateDetails);

  registerClusterTemplateDetails.$inject = [
    'horizon.dashboard.container-infra.cluster-templates.basePath',
    'horizon.dashboard.container-infra.cluster-templates.resourceType',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function registerClusterTemplateDetails(
    basePath,
    resourceType,
    magnum,
    registry
  ) {
    registry.getResourceType(resourceType)
      .setLoadFunction(loadFunction)
      .detailsViews.append({
        id: 'templateDetailsOverview',
        name: gettext('Overview'),
        template: basePath + 'details/overview.html'
      });

    function loadFunction(identifier) {
      return magnum.getClusterTemplate(identifier);
    }
  }

})();
