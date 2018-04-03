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
   * @ngname horizon.dashboard.container-infra.quotas.actions
   *
   * @description
   * Provides all of the actions for quotas.
   */
  angular.module('horizon.dashboard.container-infra.quotas.actions',
    [
      'horizon.framework',
      'horizon.dashboard.container-infra'
    ])
    .run(registerQuotaActions);

  registerQuotaActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.container-infra.quotas.create.service',
    'horizon.dashboard.container-infra.quotas.update.service',
    'horizon.dashboard.container-infra.quotas.delete.service',
    'horizon.dashboard.container-infra.quotas.resourceType'
  ];

  function registerQuotaActions (
    registry,
    gettext,
    createQuotaService,
    updateQuotaService,
    deleteQuotaService,
    resourceType) {

    var quotaResourceType = registry.getResourceType(resourceType);
    quotaResourceType.globalActions
      .append({
        id: 'createQuotaAction',
        service: createQuotaService,
        template: {
          type: 'create',
          text: gettext('Create Quota')
        }
      });

    quotaResourceType.batchActions
      .append({
        id: 'batchDeleteQuotaService',
        service: deleteQuotaService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Quotas')
        }
      });

    quotaResourceType.itemActions
      .append({
        id: 'updateQuotaService',
        service: updateQuotaService,
        template: {
          text: gettext('Update Quota')
        }
      })
      .append({
        id: 'deleteQuotaService',
        service: deleteQuotaService,
        template: {
          type: 'delete',
          text: gettext('Delete Quota')
        }
      });
  }

})();
