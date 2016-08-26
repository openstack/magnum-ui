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
   *
   * @description
   * Provides all the services and widgets require to display the cluster template
   * panel
   */
  angular
    .module('horizon.dashboard.container-infra.cluster-templates', [
      'ngRoute',
      'horizon.dashboard.container-infra.cluster-templates.actions',
      'horizon.dashboard.container-infra.cluster-templates.details'
    ])
    .constant('horizon.dashboard.container-infra.cluster-templates.events', events())
    .constant('horizon.dashboard.container-infra.cluster-templates.resourceType', 'OS::Magnum::ClusterTemplate')
    .run(run)
    .config(config);

  /**
   * @ngdoc constant
   * @name horizon.dashboard.container-infra.cluster-templates.events
   * @description A list of events used by cluster templates
   */
  function events() {
    return {
      CREATE_SUCCESS: 'horizon.dashboard.container-infra.cluster-templates.CREATE_SUCCESS',
      DELETE_SUCCESS: 'horizon.dashboard.container-infra.cluster-templates.DELETE_SUCCESS'
    };
  }

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.cluster-templates.basePath',
    'horizon.dashboard.container-infra.cluster-templates.resourceType'
  ];

  function run(registry, magnum, basePath, resourceType) {
    registry.getResourceType(resourceType)
    .setNames(gettext('Cluster Template'), gettext('Cluster Templates'))

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
    .setProperty('network_driver', {
      label: gettext('Network Driver')
    })
    .setListFunction(listFunction)
    .tableColumns
    .append({
      id: 'name',
      priority: 1,
      sortDefault: true,
      filters: ['noName'],
      urlFunction: urlFunction
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
        {label: gettext('Kubernetes'), key: 'kubernetes'},
        {label: gettext('Mesos'), key: 'mesos'}
      ]
    })

    function listFunction(params) {
      return magnum.getClusterTemplates(params).then(modifyResponse);

      function modifyResponse(response) {
        return {data: {items: response.data.items.map(addTrackBy)}};

        function addTrackBy(cluster_template) {
          cluster_template.trackBy = cluster_template.id;
          return cluster_template;
        }
      }
    }

    function urlFunction(item) {
      return 'project/ngdetails/OS::Magnum::ClusterTemplate/' + item.id;
    }
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
    var path = $windowProvider.$get().STATIC_URL + 'dashboard/container-infra/cluster-templates/';
    $provide.constant('horizon.dashboard.container-infra.cluster-templates.basePath', path);
    $routeProvider.when('/project/cluster_templates/', {
      templateUrl: path + 'panel.html'
    });
  }
})();
