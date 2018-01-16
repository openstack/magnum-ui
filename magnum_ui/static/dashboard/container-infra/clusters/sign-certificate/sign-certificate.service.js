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
   * @name horizon.dashboard.container-infra.clusters.sign-certificate.service
   * @description Service for the container-infra cluster sign certificate modal
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.sign-certificate.service',
      signCertificateService);

  signCertificateService.$inject = [
    '$uibModal',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.basePath',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.dashboard.container-infra.clusters.sign-certificate-model',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.file.text-download',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.toast.service'
  ];

  function signCertificateService(
    $uibModal, magnum, basePath, resourceType, model, actionResult, textDownload,
    gettext, $qExtensions, toast
  ) {

    var message = {
      success: gettext('Certificate %s was successfully signed.')
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

    function signCertificateModal() {
      var localSpec = {
        backdrop: 'static',
        controller: 'horizon.dashboard.container-infra.clusters.signCertificateController as ctrl',
        templateUrl: basePath + 'sign-certificate/sign-certificate-modal.html'
      };
      return $uibModal.open(localSpec).result;
    }

    function perform(selected) {
      model.init(selected.id);
      return signCertificateModal().then(submit);
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    function submit() {
      return model.signCertificate().then(success);
    }

    function success(response) {
      textDownload.downloadTextFile(response.data.pem, model.cluster_name + "_cert.pem");

      response.data.id = response.data.uuid;
      toast.add('success', interpolate(message.success, [response.data.id]));
      var result = actionResult.getActionResult()
                   .created(resourceType, response.data.id);
      return result.result;
    }
  }
})();
