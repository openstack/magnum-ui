/**
 * Copyright 2017 NEC Corporation
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
   * @name horizon.dashboard.container-infra.clusters.update.service
   * @description Service for the container-infra cluster update modal
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.update.service', updateService);

  updateService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.form.ModalFormService',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.dashboard.container-infra.clusters.workflow'
  ];

  function updateService(
    magnum, policy, actionResult, gettext, $qExtensions, modal, toast, resourceType, workflow
  ) {

    var config;
    var message = {
      success: gettext('Cluster %s was successfully updated.')
    };

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected, $scope) {
      config = workflow.init('update', gettext('Update Cluster'), $scope);
      config.model.id = selected.id;

      // load current data
      magnum.getCluster(selected.id).then(onLoad);
      function onLoad(response) {
        config.model.name = response.data.name
          ? response.data.name : "";
        config.model.cluster_template_id = response.data.cluster_template_id
          ? response.data.cluster_template_id : "";
        config.model.master_count = response.data.master_count
          ? response.data.master_count : null;
        config.model.node_count = response.data.node_count
          ? response.data.node_count : null;
        config.model.discovery_url = response.data.discovery_url
          ? response.data.discovery_url : "";
        config.model.create_timeout = response.data.create_timeout
          ? response.data.create_timeout : null;
        config.model.keypair = response.data.keypair
          ? response.data.keypair : "";
      }

      return modal.open(config).then(submit);
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit(context) {
      var id = context.model.id;
      context.model = cleanNullProperties(context.model);
      return magnum.updateCluster(id, context.model, true)
        .then(success, true);
    }

    function cleanNullProperties(model) {
      // Initially clean fields that don't have any value.
      // Not only "null", blank too.
      for (var key in model) {
        if (model.hasOwnProperty(key) && model[key] === null || model[key] === "" ||
            key === "tabs" || key === "id") {
          delete model[key];
        }
      }
      return model;
    }

    function success(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      return actionResult.getActionResult()
        .updated(resourceType, response.data.id)
        .result;
    }
  }
})();
