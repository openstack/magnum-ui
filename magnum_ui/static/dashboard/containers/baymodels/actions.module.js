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
   * @ngname horizon.dashboard.containers.baymodels.actions
   *
   * @description
   * Provides all of the actions for baymodels.
   */
  angular.module('horizon.dashboard.containers.baymodels.actions', ['horizon.framework', 'horizon.dashboard.containers'])
   .run(registerBayModelActions);

  registerBayModelActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.containers.baymodels.create.service',
    'horizon.dashboard.containers.baymodels.delete.service',
    'horizon.dashboard.containers.bays.create.service',
    'horizon.dashboard.containers.baymodels.resourceType',
  ];

  function registerBayModelActions(
    registry,
    gettext,
    createBayModelService,
    deleteBayModelService,
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
        id: 'deleteBayModelAction',
        service: deleteBayModelService,
        template: {
          type: 'delete',
          text: gettext('Delete BayModel')
        }
      });

    baymodelResourceType.batchActions
      .append({
        id: 'createBayModelAction',
        service: createBayModelService,
        template: {
          type: 'create',
          text: gettext('Create BayModel')
        }
      })
      .append({
        id: 'batchDeleteBayModelAction',
        service: deleteBayModelService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete BayModels')
        }
      });
  }

})();
