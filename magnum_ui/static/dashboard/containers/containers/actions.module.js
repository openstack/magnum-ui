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
   * @ngname horizon.dashboard.containers.containers.actions
   *
   * @description
   * Provides all of the actions for containers.
   */
  angular.module('horizon.dashboard.containers.containers.actions', ['horizon.framework', 'horizon.dashboard.containers'])
   .run(registerContainerActions);

  registerContainerActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.containers.containers.create.service',
    'horizon.dashboard.containers.containers.delete.service',
    'horizon.dashboard.containers.containers.resourceType',
  ];

  function registerContainerActions(
    registry,
    gettext,
    createContainerService,
    deleteContainerService,
    resourceType)
  {
    var containerResourceType = registry.getResourceType(resourceType);
    containerResourceType.itemActions
      .append({
        id: 'deleteContainerAction',
        service: deleteContainerService,
        template: {
          type: 'delete',
          text: gettext('Delete Container')
        }
      });

    containerResourceType.batchActions
      .append({
        id: 'createContainerAction',
        service: createContainerService,
        template: {
          type: 'create',
          text: gettext('Create Container')
        }
      })
      .append({
        id: 'batchDeleteContainerAction',
        service: deleteContainerService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Containers')
        }
      });
  }

})();
