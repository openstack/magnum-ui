/**
 * Copyright 2015 Cisco Systems, Inc.
 *
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
   * @name horizon.dashboard.container-infra.clusters
   * @ngModule
   *
   * @description
   * Provides all the services and widgets require to display the cluster
   * panel
   */
  angular
    .module('horizon.dashboard.container-infra.clusters', [
      'ngRoute',
      'horizon.dashboard.container-infra.clusters.actions',
      'horizon.dashboard.container-infra.clusters.details'
    ])
    .decorator('actionsDirective', actionsDirectiveDecorator)
    .constant('horizon.dashboard.container-infra.clusters.events', events())
    .constant('horizon.dashboard.container-infra.clusters.resourceType', 'OS::Magnum::Cluster')
    .run(run)
    .config(config);

  /**
   * @ngdoc constant
   * @name clusters.events
   * @returns {Object} The event object
   * @description A list of events used by Clusters
   */
  function events() {
    return {
      CREATE_SUCCESS: 'horizon.dashboard.container-infra.clusters.CREATE_SUCCESS',
      DELETE_SUCCESS: 'horizon.dashboard.container-infra.clusters.DELETE_SUCCESS'
    };
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.container-infra.clusters.service',
    'horizon.dashboard.container-infra.clusters.basePath',
    'horizon.dashboard.container-infra.clusters.resourceType'
  ];

  function run(registry, clustersService, basePath, resourceType) {
    registry.getResourceType(resourceType)
    .setNames(gettext('Cluster'), gettext('Clusters'))
    .setDefaultIndexUrl('/project/clusters/')
    // for detail summary view on table row.
    .setSummaryTemplateUrl(basePath + 'details/drawer.html')
    // for table row items and detail summary view.
    .setProperty('name', {
      label: gettext('Name')
    })
    .setProperty('id', {
      label: gettext('ID')
    })
    .setProperty('status', {
      label: gettext('Status')
    })
    .setProperty('health_status', {
      label: gettext('Health Status')
    })
    .setProperty('master_count', {
      label: gettext('Control Plane Count')
    })
    .setProperty('node_count', {
      label: gettext('Node Count')
    })
    .setProperty('coe_version', {
      label: gettext('Kubernetes Version')
    })
    .setListFunction(clustersService.getClustersPromise)
    .tableColumns
    .append({
      id: 'name',
      priority: 1,
      sortDefault: true,
      filters: ['noName'],
      urlFunction: clustersService.urlFunction
    })
    .append({
      id: 'id',
      priority: 2
    })
    .append({
      id: 'status',
      priority: 1
    })
    .append({
      id: 'health_status',
      priority: 1
    })
    .append({
      id: 'master_count',
      priority: 2
    })
    .append({
      id: 'node_count',
      priority: 2
    })
    .append({
      id: 'coe_version',
      priority: 2
    });

    // for magic-search
    registry.getResourceType(resourceType).filterFacets
    .append({
      'label': gettext('Name'),
      'name': 'name',
      'singleton': true
    })
    .append({
      'label': gettext('ID'),
      'name': 'id',
      'singleton': true
    })
    .append({
      'label': gettext('Status'),
      'name': 'status',
      'singleton': true,
      'options': [
        {label: gettext('Adopt complete'), key: 'ADOPT_COMPLETE'},
        {label: gettext('Check complete'), key: 'CHECK_COMPLETE'},
        {label: gettext('Create complete'), key: 'CREATE_COMPLETE'},
        {label: gettext('Create failed'), key: 'CREATE_FAILED'},
        {label: gettext('Create in progress'), key: 'CREATE_IN_PROGRESS'},
        {label: gettext('Delete complete'), key: 'DELETE_COMPLETE'},
        {label: gettext('Delete failed'), key: 'DELETE_FAILED'},
        {label: gettext('Delete in progress'), key: 'DELETE_IN_PROGRESS'},
        {label: gettext('Restore complete'), key: 'RESTORE_COMPLETE'},
        {label: gettext('Resume complete'), key: 'RESUME_COMPLETE'},
        {label: gettext('Rollback complete'), key: 'ROLLBACK_COMPLETE'},
        {label: gettext('Snapshot complete'), key: 'SNAPSHOT_COMPLETE'},
        {label: gettext('Update complete'), key: 'UPDATE_COMPLETE'},
        {label: gettext('Update failed'), key: 'UPDATE_FAILED'},
        {label: gettext('Update in progress'), key: 'UPDATE_IN_PROGRESS'}
      ]
    })
    .append({
      'label': gettext('Health Status'),
      'name': 'health_status',
      'singleton': true
    })
    .append({
      'label': gettext('Control Plane Count'),
      'name': 'master_count',
      'singleton': true
    })
    .append({
      'label': gettext('Node Count'),
      'name': 'node_count',
      'singleton': true
    })
    .append({
      'label': gettext('Kubernetes Version'),
      'name': 'coe_version',
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
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/container-infra/clusters/';
    $provide.constant('horizon.dashboard.container-infra.clusters.basePath', path);
    $routeProvider.when('/project/clusters', {
      templateUrl: path + 'panel.html'
    });
  }

  actionsDirectiveDecorator.$inject = [
    '$delegate',
    'horizon.dashboard.container-infra.clusters.utils'
  ];

  /**
   * @param {Object} $delegate
   * @param {Object} clustersUtils
   * @description Extends behaviour of `horizon.framework.widgets.action-list.directive:actions`
   * with business logic in clusters.getActionsDirectiveLinkFn();
   * @return {Object} Returns the ammended directive.
   */
  function actionsDirectiveDecorator($delegate, clustersUtils) {
    var directive = $delegate[0];

    // Angular's `link` is wrapped inside the compile function
    directive.compile = function() {
      return clustersUtils.getActionsDirectiveLinkFn(directive);
    };

    return $delegate;
  }
})();
