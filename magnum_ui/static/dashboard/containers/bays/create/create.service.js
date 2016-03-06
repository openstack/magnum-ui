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
   * @ngdoc overview
   * @name horizon.dashboard.containers.bays.create.service
   * @description Service for the containers bay create modal
   */
  angular
    .module('horizon.dashboard.containers.bays')
    .factory('horizon.dashboard.containers.bays.create.service', createService);

  createService.$inject = [
    'bayModel',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.containers.bays.workflow',
    'horizon.dashboard.containers.bays.events',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions'
  ];

  function createService(
    model, wizardModalService, toast, createWorkflow, events, policy, gettext, $qExtensions
  ) {

    var scope;
    var message = {
      success: gettext('Bay %s was successfully created.')
    };

    var service = {
      initScope: initScope,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initScope($scope) {
      scope = $scope;

      scope.workflow = createWorkflow;
      scope.model = model;
      scope.$on('$destroy', function() {
      });
    }

    function perform() {
      scope.model.init();
      wizardModalService.modal({
        scope: scope,
        workflow: createWorkflow,
        submit: submit
      });
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit(){
      return model.createBay().then(success);
    }

    function success(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      scope.$emit(events.CREATE_SUCCESS, response.data);
    }
  }
})();
