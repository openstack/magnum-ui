/**
 * Copyright 2015 NEC Corporation
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
   * @ngdoc controller
   * @name createBaymodelSpecController
   * @ngController
   *
   * @description
   * Controller for the bay model spec step in create workflow
   */
  angular
    .module('horizon.dashboard.container-infra.baymodels')
    .controller('createBaymodelSpecController', createBaymodelSpecController);

  createBaymodelSpecController.$inject = [
    '$q',
    '$scope',
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.core.openstack-service-api.glance'
  ];

  function createBaymodelSpecController($q, $scope, basePath, magnum, nova, glance) {
    var ctrl = this;
    ctrl.images = [{id:"", name: gettext("Choose an Image")}];
    ctrl.nflavors = [{id:"", name: gettext("Choose a Flavor for the Node")}];
    ctrl.mflavors = [{id:"", name: gettext("Choose a Flavor for the Master Node")}];
    ctrl.keypairs = [{id:"", name: gettext("Choose a Keypair")}];

    init();

    function init() {
      glance.getImages().success(onGetImages);
      nova.getFlavors(false, false).success(onGetFlavors); // isPublic, getExtras
      nova.getKeypairs().success(onGetKeypairs);
    }

    function onGetImages(response) {
      angular.forEach(response.items, function(item) {
        this.push({id: item.name, name: item.name});
      }, ctrl.images);
    }

    function onGetFlavors(response) {
      angular.forEach(response.items, function(item) {
        this.push({id: item.name, name: item.name});
      }, ctrl.nflavors);
      angular.forEach(response.items, function(item) {
        this.push({id: item.name, name: item.name});
      }, ctrl.mflavors);
    }

    function onGetKeypairs(response) {
      angular.forEach(response.items, function(item) {
        this.push({id: item.keypair.name, name: item.keypair.name});
      }, ctrl.keypairs);
    }

  };

})();
