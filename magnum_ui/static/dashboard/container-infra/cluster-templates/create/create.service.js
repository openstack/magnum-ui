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
   * @name horizon.dashboard.container-infra.cluster-templates.create.service
   * @description Service for the container-infra cluster template create modal
   */
  angular
    .module('horizon.dashboard.container-infra.cluster-templates')
    .factory('horizon.dashboard.container-infra.cluster-templates.create.service', createService);

  createService.$inject = [
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.wizard-modal.service',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.container-infra.cluster-templates.model',
    'horizon.dashboard.container-infra.cluster-templates.events',
    'horizon.dashboard.container-infra.cluster-templates.resourceType',
    'horizon.dashboard.container-infra.cluster-templates.workflow'
  ];

  function createService(
    policy, actionResult, gettext, $qExtensions, wizardModalService,
    toast, model, events, resourceType, createWorkflow
  ) {

    var scope;
    var message = {
      success: gettext('Cluster template %s was successfully created.')
    };

    var service = {
      initAction: initAction,
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function initAction() {
    }

    function perform(selected, $scope) {
      scope = $scope;
      scope.workflow = createWorkflow;
      scope.model = model;
      scope.$on('$destroy', function() {
      });
      scope.model.init();
      return wizardModalService.modal({
        scope: scope,
        workflow: createWorkflow,
        submit: submit
      }).result;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit() {
      return model.createClusterTemplate().then(success);
    }

    function success(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      return actionResult.getActionResult()
        .created(resourceType, response.data.id)
        .result;
    }
  }
})();
