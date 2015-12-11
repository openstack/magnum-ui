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
    .module('horizon.dashboard.containers.bays')
    .controller('BayDetailController', BayDetailController);

  BayDetailController.$inject = [
    '$window',
    'horizon.app.core.openstack-service-api.magnum',
    '$routeParams'
  ];

  function BayDetailController($window, magnum, $routeParams) {
    var ctrl = this;
    ctrl.bay = {};
    ctrl.baymodel = {};

    var bayId = $routeParams.bayId;

    init();

    function init() {
      // Load the elements that are used in the overview.
      magnum.getBay(bayId).success(onGetBay);
    }

    function onGetBay(bay) {
      ctrl.bay = bay;
      magnum.getBayModel(ctrl.bay.baymodel_id).success(onGetBayModel);
    }

    function onGetBayModel(baymodel) {
      ctrl.baymodel = baymodel;
    }
  }
})();