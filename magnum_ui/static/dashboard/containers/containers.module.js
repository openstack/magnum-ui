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
      'horizon.dashboard.containers.bay',
      'horizon.dashboard.containers.baymodel',
      'horizon.dashboard.containers.containers',
      'ngRoute'
    ])
    .config(config);

  config.$inject = ['$provide', '$windowProvider',
                    '$routeProvider', '$locationProvider'];

  function config($provide, $windowProvider, $routeProvider, $locationProvider) {
    $locationProvider
    .html5Mode({
      enabled: true
    });

    var path = $windowProvider.$get().STATIC_URL + 'dashboard/containers/';
    $provide.constant('horizon.dashboard.containers.basePath', path);

    $routeProvider
    .when('/baymodel', {
      templateUrl: path + 'baymodel/table/table.html'
    })
    .when('/baymodel/:baymodelId', {
      templateUrl: path + 'baymodel/detail/detail.html'
    })
    .when('/', {
      templateUrl: path + 'bay/table/table.html'
    })
    .when('/:bayId', {
      templateUrl: path + 'bay/detail/detail.html'
    })
    .otherwise({
      redirectTo: '/'
    });
  }

})();
