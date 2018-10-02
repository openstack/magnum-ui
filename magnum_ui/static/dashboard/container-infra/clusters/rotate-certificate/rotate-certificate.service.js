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
   * @name horizon.dashboard.container-infra.clusters.rotate-certificate.service
   * @description Service for the container-infra cluster rotate certificate
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.rotate-certificate.service',
      rotateCertificateService);

  rotateCertificateService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.toast.service'
  ];

  function rotateCertificateService(
    magnum, resourceType, actionResult, gettext, $qExtensions, toast
  ) {

    var message = {
      success: gettext('Certificate %s was successfully rotated.')
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

    function perform(selected) {
      // rotate certificate
      return magnum.rotateCertificate(selected.id).then(success);
    }

    function success(response) {
      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      var result = actionResult.getActionResult()
                   .deleted(resourceType, response.data.id);
      return result.result;
    }

    function allowed() {
      // NOTE(flwang): So far, Magnum doesn't support rotate certificate, so
      // let's disable it now until we can support it.
      return $qExtensions.booleanAsPromise(false);
    }
  }
})();
