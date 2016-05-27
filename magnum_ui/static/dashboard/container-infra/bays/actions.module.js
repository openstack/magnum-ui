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
   * @ngname horizon.dashboard.container-infra.bays.actions
   *
   * @description
   * Provides all of the actions for bays.
   */
  angular.module('horizon.dashboard.container-infra.bays.actions', ['horizon.framework', 'horizon.dashboard.container-infra'])
   .run(registerBayActions);

  registerBayActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.container-infra.bays.create.service',
    'horizon.dashboard.container-infra.bays.delete.service',
    'horizon.dashboard.container-infra.bays.resourceType',
  ];

  function registerBayActions(
    registry,
    gettext,
    createBayService,
    deleteBayService,
    resourceType)
  {
    var bayResourceType = registry.getResourceType(resourceType);
    bayResourceType.itemActions
      .append({
        id: 'deleteBayAction',
        service: deleteBayService,
        template: {
          type: 'delete',
          text: gettext('Delete Bay')
        }
      });

    bayResourceType.batchActions
      .append({
        id: 'createBayAction',
        service: createBayService,
        template: {
          type: 'create',
          text: gettext('Create Bay')
        }
      })
      .append({
        id: 'batchDeleteBayAction',
        service: deleteBayService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Bays')
        }
      });
  }

})();
