/*
 * Copyright 2015 NEC Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular
    .module('horizon.dashboard.containers')
    .controller('BayModelDetailController', BayModelDetailController);

  BayModelDetailController.$inject = [
    '$window',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.glance',
    '$routeParams'
  ];

  function BayModelDetailController($window, magnum, glance, $routeParams) {
    var ctrl = this;
    ctrl.baymodel = {};
    ctrl.image_uuid;

    var baymodelId = $routeParams.baymodelId;

    init();

    function init() {
      // Load the elements that are used in the overview.
      magnum.getBayModel(baymodelId).success(onGetBayModel);
    }

    function onGetBayModel(baymodel) {
      ctrl.baymodel = baymodel;
      glance.getImages().success(onGetImages);
    }

    function onGetImages(images) {
      angular.forEach(images.items, function(image) {
        if (image.name === ctrl.baymodel.image_id) {
          ctrl.image_uuid = image.id;
        }
      });
    }
  }
})();