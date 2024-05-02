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

        function setModelFromResponse(key, defaultValue) {
          if (response.data[key]) {
            config.model[key] = response.data[key];
          } else {
            config.model[key] = defaultValue;
          }

        }

        setModelFromResponse('name', "");
        setModelFromResponse('coe', "");
        setModelFromResponse('server_type', "");
        setModelFromResponse('public', false);
        setModelFromResponse('hidden', false);
        setModelFromResponse('registry_enabled', false);
        setModelFromResponse('tls_disabled', false);
        setModelFromResponse('image_id', "");
        setModelFromResponse('flavor_id', "");
        setModelFromResponse('master_flavor_id', "");
        setModelFromResponse('docker_volume_size', "");
        setModelFromResponse('docker_storage_driver', "");
        setModelFromResponse('keypair_id', "");
        setModelFromResponse('network_driver', "");
        setModelFromResponse('volume_driver', "");
        setModelFromResponse('insecure_registry', "");
        setModelFromResponse('http_proxy', "");
        setModelFromResponse('https_proxy', "");
        setModelFromResponse('no_proxy', "");
        setModelFromResponse('external_network_id', "");
        setModelFromResponse('fixed_network', "");
        setModelFromResponse('fixed_subnet', "");
        setModelFromResponse('dns_nameserver', "");
        setModelFromResponse('master_lb_enabled', false);
        setModelFromResponse('floating_ip_enabled', false);

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
