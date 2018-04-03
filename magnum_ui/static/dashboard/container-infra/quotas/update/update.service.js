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
   * @name horizon.dashboard.container-infra.quotas.update.service
   * @description Service for the container-infra quotas update modal
   */
  angular
    .module('horizon.dashboard.container-infra.quotas')
    .factory('horizon.dashboard.container-infra.quotas.update.service', updateService);

  updateService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.container-infra.quotas.resourceType',
    'horizon.dashboard.container-infra.quotas.workflow'
  ];

  function updateService(
    magnum, policy, actionResult, gettext, $qExtensions, modal, toast, resourceType, workflow
  ) {

    var config;
    var message = {
      success: gettext('Quota %s/%s was successfully updated.')
    };

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected, $scope) {
      config = workflow.init('update', gettext('Update Quota'), $scope);
      config.model.id = selected.id;

      // load current data
      magnum.getQuota(selected.project_id, selected.resource).then(onLoad);
      function onLoad(response) {
        config.model.id = response.data.id
          ? response.data.id : "";
        config.model.project_id = response.data.project_id
          ? response.data.project_id : "";
        config.model.resource = response.data.resource
          ? response.data.resource : "Cluster";
        config.model.hard_limit = response.data.hard_limit
          ? response.data.hard_limit : null;
      }

      return modal.open(config).then(submit);
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit(context) {
      context.model = cleanNullProperties(context.model);
      return magnum.updateQuota(context.model.project_id, context.model.resource, context.model)
        .then(success, true);
    }

    function cleanNullProperties(model) {
      // Initially clean fields that don't have any value.
      // Not only "null", blank too.
      for (var key in model) {
        if (model.hasOwnProperty(key) && model[key] === null || model[key] === "") {
          delete model[key];
        }
      }
      return model;
    }

    function success(response) {
      toast.add('success', interpolate(message.success, [
        response.data.project_id, response.data.resource]));
      return actionResult.getActionResult()
        .updated(resourceType, response.data.id)
        .result;
    }
  }
})();
