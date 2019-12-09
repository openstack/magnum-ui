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
   * @name horizon.dashboard.container-infra.cluster-templates
   * @ngModule
   * @description
   * Provides all the services and widgets require to display the cluster template
   * panel
   */
  angular
    .module('horizon.dashboard.container-infra.cluster-templates',
    [
      'ngRoute',
      'horizon.dashboard.container-infra.cluster-templates.actions',
      'horizon.dashboard.container-infra.cluster-templates.details'
    ])
    .constant('horizon.dashboard.container-infra.cluster-templates.events', events())
    .constant('horizon.dashboard.container-infra.cluster-templates.distros', distros())
    .constant(
      'horizon.dashboard.container-infra.cluster-templates.resourceType',
      'OS::Magnum::ClusterTemplate')
    .run(run)
    .config(config);

  /**
   * @ngdoc constant
   * @name events
   * @returns {Object} The event object
   * @description A list of events for cluster templates
   */
  function events() {
    return {
      CREATE_SUCCESS: 'horizon.dashboard.container-infra.cluster-templates.CREATE_SUCCESS',
      DELETE_SUCCESS: 'horizon.dashboard.container-infra.cluster-templates.DELETE_SUCCESS'
    };
  }

  /**
   * @ngdoc constant
   * @name distros
   * @return [distros] available image distros
   * @description A list available image distros for magnum
  */
  function distros() {
    return ["coreos", "fedora-atomic", "fedora-coreos", "ubuntu"];
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.dashboard.container-infra.cluster-templates.service',
    'horizon.dashboard.container-infra.cluster-templates.basePath',
    'horizon.dashboard.container-infra.cluster-templates.resourceType'
  ];

  function run(registry, clusterTemplatesService, basePath, resourceType) {
    registry.getResourceType(resourceType)
    .setNames(gettext('Cluster Template'), gettext('Cluster Templates'))
    .setDefaultIndexUrl('/project/cluster_templates/')
    // for detail summary view on table row
    .setSummaryTemplateUrl(basePath + 'details/drawer.html')
    // for table row items and detail summary view.
    .setProperty('name', {
      label: gettext('Name')
    })
    .setProperty('id', {
      label: gettext('ID')
    })
    .setProperty('coe', {
      label: gettext('COE')
    })
    .setProperty('keypair_id', {
      label: gettext('Keypair')
    })
    .setProperty('network_driver', {
      label: gettext('Network Driver')
    })
    .setListFunction(clusterTemplatesService.getClusterTemplatesPromise)
    .tableColumns
    .append({
      id: 'name',
      priority: 1,
      sortDefault: true,
      filters: ['noName'],
      urlFunction: clusterTemplatesService.urlFunction
    })
    .append({
      id: 'id',
      priority: 2
    })
    .append({
      id: 'coe',
      priority: 1
    })
    .append({
      id: 'keypair_id',
      priority: 1,
      filters: ['noValue']
    })
    .append({
      id: 'network_driver',
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
      'label': gettext('COE'),
      'name': 'coe',
      'singleton': true,
      options: [
        {label: gettext('Docker Swarm'), key: 'swarm'},
        {label: gettext('Docker Swarm Mode'), key: 'swarm-mode'},
        {label: gettext('Kubernetes'), key: 'kubernetes'},
        {label: gettext('DC/OS'), key: 'dcos'},
        {label: gettext('Mesos'), key: 'mesos'}
      ]
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
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/container-infra/cluster-templates/';
    $provide.constant('horizon.dashboard.container-infra.cluster-templates.basePath', path);
    $routeProvider.when('/project/cluster_templates', {
      templateUrl: path + 'panel.html'
    });
  }
})();
