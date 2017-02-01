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
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.container-infra.cluster-templates.resourceType',
    'horizon.dashboard.container-infra.cluster-templates.workflow'
  ];

  function createService(
    magnum, policy, actionResult, gettext, $qExtensions, modal, toast, resourceType, workflow
  ) {

    var config;
    var message = {
      success: gettext('Cluster template %s was successfully created.')
    };

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform() {
      config = workflow.init('create', gettext('Create Cluster Template'));
      return modal.open(config).then(submit);
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit(context) {
      context.model = cleanNullProperties(context.model);
      return magnum.createClusterTemplate(context.model, true).then(success, true);
    }

    function cleanNullProperties(model) {
      // Initially clean fields that don't have any value.
      // Not only "null", blank too.
      for (var key in model) {
        if (model.hasOwnProperty(key) && model[key] === null || model[key] === "" ||
            key === "tabs") {
          delete model[key];
        }
      }
      return model;
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
