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
   * @ngname horizon.dashboard.container-infra.baymodels.actions
   *
   * @description
   * Provides all of the actions for baymodels.
   */
  angular.module('horizon.dashboard.container-infra.baymodels.actions', ['horizon.framework', 'horizon.dashboard.container-infra'])
   .run(registerBaymodelActions);

  registerBaymodelActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.container-infra.baymodels.create.service',
    'horizon.dashboard.container-infra.baymodels.delete.service',
    'horizon.dashboard.container-infra.bays.create.service',
    'horizon.dashboard.container-infra.baymodels.resourceType',
  ];

  function registerBaymodelActions(
    registry,
    gettext,
    createBaymodelService,
    deleteBaymodelService,
    createBayService,
    resourceType)
  {
    var baymodelResourceType = registry.getResourceType(resourceType);
    baymodelResourceType.itemActions
      .append({
        id: 'createBayAction',
        service: createBayService,
        template: {
          text: gettext('Create Bay')
        }
      })
      .append({
        id: 'deleteBaymodelAction',
        service: deleteBaymodelService,
        template: {
          type: 'delete',
          text: gettext('Delete Baymodel')
        }
      });

    baymodelResourceType.batchActions
      .append({
        id: 'createBaymodelAction',
        service: createBaymodelService,
        template: {
          type: 'create',
          text: gettext('Create Baymodel')
        }
      })
      .append({
        id: 'batchDeleteBaymodelAction',
        service: deleteBaymodelService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Baymodels')
        }
      });
  }

})();
