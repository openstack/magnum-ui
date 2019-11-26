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
   * @name horizon.dashboard.container-infra.cluster-templates.update.service
   * @description Service for the container-infra cluster template update modal
   */
  angular
    .module('horizon.dashboard.container-infra.cluster-templates')
    .factory('horizon.dashboard.container-infra.cluster-templates.update.service', updateService);

  updateService.$inject = [
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

  function updateService(
    magnum, policy, actionResult, gettext, $qExtensions, modal, toast, resourceType, workflow
  ) {

    var config;
    var message = {
      success: gettext('Cluster template %s was successfully updated.')
    };

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////

    function perform(selected) {
      config = workflow.init('update', gettext('Update Cluster Template'));
      config.model.id = selected.id;

      // load current data
      magnum.getClusterTemplate(selected.id).then(onLoad);
      function onLoad(response) {
        config.model.name = response.data.name
          ? response.data.name : "";
        config.model.coe = response.data.coe
          ? response.data.coe : "";
        config.model.server_type = response.data.server_type
          ? response.data.server_type : "";
        config.model.public = response.data.public
          ? response.data.public : false;
        config.model.hidden = response.data.hidden
          ? response.data.hidden : false;
        config.model.registry_enabled = response.data.registry_enabled
          ? response.data.registry_enabled : false;
        config.model.tls_disabled = response.data.tls_disabled
          ? response.data.tls_disabled : false;
        config.model.image_id = response.data.image_id
          ? response.data.image_id : "";
        config.model.flavor_id = response.data.flavor_id
          ? response.data.flavor_id : "";
        config.model.master_flavor_id = response.data.master_flavor_id
          ? response.data.master_flavor_id : "";
        config.model.docker_volume_size = response.data.docker_volume_size
          ? response.data.docker_volume_size : "";
        config.model.docker_storage_driver = response.data.docker_storage_driver
          ? response.data.docker_storage_driver : "";
        config.model.keypair_id = response.data.keypair_id
          ? response.data.keypair_id : "";
        config.model.network_driver = response.data.network_driver
          ? response.data.network_driver : "";
        config.model.volume_driver = response.data.volume_driver
          ? response.data.volume_driver : "";
        config.model.insecure_registry = response.data.insecure_registry
          ? response.data.insecure_registry : "";
        config.model.http_proxy = response.data.http_proxy
          ? response.data.http_proxy : "";
        config.model.https_proxy = response.data.https_proxy
          ? response.data.https_proxy : "";
        config.model.no_proxy = response.data.no_proxy
          ? response.data.no_proxy : "";
        config.model.external_network_id = response.data.external_network_id
          ? response.data.external_network_id : "";
        config.model.fixed_network = response.data.fixed_network
          ? response.data.fixed_network : "";
        config.model.fixed_subnet = response.data.fixed_subnet
          ? response.data.fixed_subnet : "";
        config.model.dns_nameserver = response.data.dns_nameserver
          ? response.data.dns_nameserver : "";
        config.model.master_lb_enabled = response.data.master_lb_enabled
          ? response.data.master_lb_enabled : false;
        config.model.floating_ip_enabled = response.data.floating_ip_enabled
          ? response.data.floating_ip_enabled : false;
        var labels = "";
        for (var key in response.data.labels) {
          if (response.data.labels.hasOwnProperty(key)) {
            if (labels !== "") {
              labels += ",";
            }
            labels += key + "=" + response.data.labels[key];
          }
        }
        config.model.labels = labels; //

        // update workflow
        workflow.update(config);
      }

      return modal.open(config).then(submit);
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit(context) {
      var id = context.model.id;
      context.model = cleanNullProperties(context.model);
      return magnum.updateClusterTemplate(id, context.model, true)
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
