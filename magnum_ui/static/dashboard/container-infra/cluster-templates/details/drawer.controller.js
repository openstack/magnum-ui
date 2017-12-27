/**
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
   * @name horizon.dashboard.container-infra.cluster-templates.DrawerController
   * @description
   * This is the controller for the cluster templates drawer (summary) view.
   * Its primary purpose is to provide the metadata definitions to
   * the template via the ctrl.metadataDefs member.
   */
  angular
    .module('horizon.dashboard.container-infra.cluster-templates')
    .controller('horizon.dashboard.container-infra.cluster-templates.DrawerController', controller);

  controller.$inject = [
  ];

  function controller() {
    var ctrl = this;
    ctrl.objLen = objLen;

    function objLen(obj) {
      var length = 0;
      if (typeof obj === 'object') {
        length = Object.keys(obj).length;
      }
      return length;
    }
  }

})();
