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
   * @ngname horizon.dashboard.container-infra.cluster-templates.actions
   *
   * @description
   * Provides all of the actions for cluster templates.
   */
  angular.module('horizon.dashboard.container-infra.cluster-templates.actions',
    [
      'horizon.framework',
      'horizon.dashboard.container-infra'
    ])
    .run(registerClusterTemplateActions);

  registerClusterTemplateActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.container-infra.cluster-templates.create.service',
    'horizon.dashboard.container-infra.cluster-templates.delete.service',
    'horizon.dashboard.container-infra.cluster-templates.update.service',
    'horizon.dashboard.container-infra.clusters.create.service',
    'horizon.dashboard.container-infra.cluster-templates.resourceType'
  ];

  function registerClusterTemplateActions(
    registry,
    gettext,
    createClusterTemplateService,
    deleteClusterTemplateService,
    updateClusterTemplateService,
    createClusterService,
    resourceType) {

    var templateResourceType = registry.getResourceType(resourceType);

    templateResourceType.globalActions
      .append({
        id: 'createClusterTemplateAction',
        service: createClusterTemplateService,
        template: {
          type: 'create',
          text: gettext('Create Cluster Template')
        }
      });

    templateResourceType.batchActions
      .append({
        id: 'batchDeleteClusterTemplateAction',
        service: deleteClusterTemplateService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Cluster Templates')
        }
      });

    templateResourceType.itemActions
      .append({
        id: 'createClusterAction',
        service: createClusterService,
        template: {
          text: gettext('Create Cluster')
        }
      })
      .append({
        id: 'updateClusterTemplateAction',
        service: updateClusterTemplateService,
        template: {
          text: gettext('Update Cluster Template')
        }
      })
      .append({
        id: 'deleteClusterTemplateAction',
        service: deleteClusterTemplateService,
        template: {
          type: 'delete',
          text: gettext('Delete Cluster Template')
        }
      });
  }
})();
