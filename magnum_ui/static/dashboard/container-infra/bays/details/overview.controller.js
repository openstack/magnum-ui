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
    .module('horizon.dashboard.container-infra.bays')
    .controller('BayOverviewController', BayOverviewController);

  BayOverviewController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.bays.resourceType',
    'horizon.dashboard.container-infra.bays.events',
    'horizon.framework.conf.resource-type-registry.service'
  ];

  function BayOverviewController(
    $scope,
    magnum,
    resourceType,
    events,
    registry
  ) {
    var ctrl = this;
    ctrl.bay = {};
    ctrl.baymodel = {};

    $scope.context.loadPromise.then(onGetBay);

    function onGetBay(bay) {
      ctrl.bay = bay.data;
      magnum.getBaymodel(ctrl.bay.baymodel_id).success(onGetBaymodel);
    }

    function onGetBaymodel(baymodel) {
      ctrl.baymodel = baymodel;
    }
  }
})();
