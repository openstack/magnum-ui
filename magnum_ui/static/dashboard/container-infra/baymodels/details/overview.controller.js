/*
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
    .module('horizon.dashboard.container-infra.baymodels')
    .controller('BaymodelOverviewController', BaymodelOverviewController);

  BaymodelOverviewController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.glance',
    'horizon.dashboard.container-infra.baymodels.resourceType',
    'horizon.dashboard.container-infra.baymodels.events',
    'horizon.dashboard.container-infra.bays.events',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function BaymodelOverviewController(
    $scope,
    glance,
    resourceType,
    events,
    bayEvents,
    registry
  ) {
    var ctrl = this;
    ctrl.baymodel = {};
    ctrl.image_uuid;

    $scope.context.loadPromise.then(onGetBaymodel);

    function onGetBaymodel(baymodel) {
      ctrl.baymodel = baymodel.data;
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
