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
    .controller('ContainerDetailController', ContainerDetailController);

  ContainerDetailController.$inject = [
    '$window',
    'horizon.app.core.openstack-service-api.magnum',
    '$routeParams'
  ];

  function ContainerDetailController($window, magnum, $routeParams) {
    var ctrl = this;
    ctrl.container = {};
    ctrl.bay = {};
    ctrl.baymodel = {};
    ctrl.memoryunits = { "b": gettext("bytes"),
        "k": gettext("KB"),
        "m": gettext("MB"),
        "g": gettext("GB")};


    var containerId = $routeParams.containerId;

    init();

    function init() {
      // Load the elements that are used in the overview.
      magnum.getContainer(containerId).success(onGetContainer);
    }

    function onGetContainer(container) {
      ctrl.container = container;
      magnum.getBay(ctrl.container.bay_uuid).success(onGetBay);

      ctrl.container.memorysize = "";
      ctrl.container.memoryunit = "";
      if(ctrl.container.memory !== null){
        // separate number and unit, then using gettext() to unit.
        var regex = /(\d+)([bkmg]?)/;
        var match = regex.exec(ctrl.container.memory);
        ctrl.container.memorysize = match[1];
        if(match[2]){
          ctrl.container.memoryunit = ctrl.memoryunits[match[2]];
        }
      }
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