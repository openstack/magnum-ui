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
   * @name horizon.dashboard.containers
   *
   * @description
   * Dashboard module to host various containers panels.
   */
  angular
    .module('horizon.dashboard.containers', [
      'horizon.dashboard.containers.bays',
      'horizon.dashboard.containers.baymodels',
      'horizon.dashboard.containers.containers',
      'ngRoute'
    ])
    .config(config)

  config.$inject = ['$provide', '$windowProvider',
                    '$routeProvider', '$locationProvider'];

  function config($provide, $windowProvider, $routeProvider, $locationProvider) {
    /* FIXME (shu-mutou): remove settings for $locationProvider if following patch is merged.
     * https://review.openstack.org/#/c/260741/
     */
    $locationProvider
      .html5Mode({
        enabled: true
      })
      .hashPrefix('!');

    var path = $windowProvider.$get().STATIC_URL + 'dashboard/containers/';
    $provide.constant('horizon.dashboard.containers.basePath', path);

    $routeProvider
    .when('/project/bays/containers', {
      templateUrl: path + 'containers/table/table.html'
    })
    .when('/project/bays/containers/:containerId', {
      templateUrl: path + 'containers/detail/detail.html'
    })
    .when('/project/baymodels', {
      templateUrl: path + 'baymodels/table/table.html'
    })
    .when('/project/baymodels/:baymodelId', {
      templateUrl: path + 'baymodels/detail/detail.html'
    })
    .when('/project/bays', {
      templateUrl: path + 'bays/table/table.html'
    })
    .when('/project/bays/:bayId', {
      templateUrl: path + 'bays/detail/detail.html'
    });
  }
})();
