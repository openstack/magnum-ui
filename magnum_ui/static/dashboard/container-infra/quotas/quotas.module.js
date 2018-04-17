/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  'use strict';

  /**
   * @ngdoc overview
   * @name horizon.dashboard.container-infra.quotas
   * @ngModule
   * @description
   * Provides all the services and widgets require to display the quotas template
   * panel
   */
  angular
    .module('horizon.dashboard.container-infra.quotas',
    [
      'ngRoute',
      'horizon.dashboard.container-infra.quotas.actions'
    ])
    .constant('horizon.dashboard.container-infra.quotas.events', events())
    .constant(
      'horizon.dashboard.container-infra.quotas.resourceType',
      'OS::Magnum::Quota')
    .run(run)
    .config(config);

  /**
   * @ngdoc constant
   * @name events
   * @returns {Object} The event object
   * @description A list of events for quotas
   */
  function events() {
    return {
      CREATE_SUCCESS: 'horizon.dashboard.container-infra.quotas.CREATE_SUCCESS',
      UPDATE_SUCCESS: 'horizon.dashboard.container-infra.quotas.UPDATE_SUCCESS',
      DELETE_SUCCESS: 'horizon.dashboard.container-infra.quotas.DELETE_SUCCESS'
    };
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.container-infra.quotas.service',
    'horizon.dashboard.container-infra.quotas.basePath',
    'horizon.dashboard.container-infra.quotas.resourceType'
  ];

  function run(registry, quotasService, basePath, resourceType) {
    registry.getResourceType(resourceType)
    .setNames(gettext('Quota'), gettext('Quotas'))
    // for table row items.
    .setProperty('id', {
      label: gettext('ID')
    })
    .setProperty('project_id', {
      label: gettext('Project ID')
    })
    .setProperty('resource', {
      label: gettext('Resource')
    })
    .setProperty('hard_limit', {
      label: gettext('Hard Limit')
    })
    .setProperty('created_at', {
      label: gettext('Created At')
    })
    .setProperty('updated_at', {
      label: gettext('Updated At')
    })
    .setListFunction(quotasService.getQuotasPromise)
    .tableColumns
    .append({
      id: 'id',
      priority: 1
    })
    .append({
      id: 'project_id',
      priority: 1
    })
    .append({
      id: 'resource',
      priority: 1
    })
    .append({
      id: 'hard_limit',
      priority: 1
    })
    .append({
      id: 'created_at',
      priority: 2,
      filters: ['simpleDate']
    })
    .append({
      id: 'updated_at',
      priority: 2,
      filters: ['simpleDate']
    });

    // for magic-search
    registry.getResourceType(resourceType).filterFacets
    .append({
      'label': gettext('Project ID'),
      'name': 'project_id',
      'singleton': true
    })
    .append({
      'label': gettext('Resource'),
      'name': 'resource',
      'singleton': true
    })
    .append({
      'label': gettext('Hard Limit'),
      'name': 'hard_limit',
      'singleton': true
    });
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @returns {undefined} Returns nothing
   * @description Routes used by this module.
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/container-infra/quotas/';
    $provide.constant('horizon.dashboard.container-infra.quotas.basePath', path);
    $routeProvider.when('/admin/container_infra/quotas', {
      templateUrl: path + 'panel.html'
    });
  }
})();
