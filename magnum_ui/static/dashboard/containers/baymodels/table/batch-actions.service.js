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

  angular
    .module('horizon.dashboard.containers.baymodels')
    .factory('horizon.dashboard.containers.baymodels.batch-actions.service', batchActions);

  batchActions.$inject = [
    'horizon.dashboard.containers.baymodels.create.createService',
    'horizon.dashboard.containers.baymodels.delete.deleteService',
    'horizon.framework.util.i18n.gettext'
  ];

  /**
   * @ngdoc factory
   * @name horizon.dashboard.containers.baymodels.table.batch-actions.service
   * @description A list of table batch actions.
   */
  function batchActions(createService, deleteService, gettext) {
    var service = {
      initScope: initScope,
      actions: actions
    };

    return service;

    ///////////////

    function initScope(scope) {
      angular.forEach([createService, deleteService], setActionScope);

      function setActionScope(action) {
        action.initScope(scope.$new());
      }
    }

    function actions() {
      return [{
        service: createService,
        template: {
          type: 'create',
          text: gettext('Create BayModel')
        }
      }, {
        service: deleteService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete BayModels')
        }
      }];
    }
  }

})();
