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
   * @name horizon.dashboard.container-infra.clusters.rotate-credential.service
   * @description Service for the container-infra cluster rotate certificate
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory(
      'horizon.dashboard.container-infra.clusters.rotate-credential.service',
      rotateCredentialService);

  rotateCredentialService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.resourceType',
    'horizon.framework.util.actions.action-result.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.framework.widgets.modal.simple-modal.service',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.framework.widgets.toast.service'
  ];

  function rotateCredentialService(
    magnum, resourceType, actionResult, gettext, $qExtensions, modal, spinnerModal, toast
  ) {
    var cluster;
    var labels = {
      title: gettext('Confirm Credential Rotation'),
      /* eslint-disable max-len */
      message: gettext('You have chosen to rotate the credentials for cluster "%(name)s" (%(id)s). If you are not already the owner of this cluster, the cluster ownership will transfer to you.'),
      submit: gettext('Rotate Cluster Credentials'),
    };
    var message = {
      success: gettext('Credentials successfully rotated for cluster "%(name)s" (%(id)s).'),
      error: gettext('Unable to rotate credentials for cluster "%(name)s" (%(id)s).'),
      errorDetail: gettext('Unable to rotate credentials for cluster "%(name)s" (%(id)s): %(reason)s.')
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
      cluster = { id: selected.id, name: selected.name };

      var options = {
        title: labels.title,
        body: getMessage(labels.message),
        submit: labels.submit
      };

      modal.modal(options).result.then(onSubmit);
    }

    function allowed() {
      // NOTE(northcottmt): Consider hiding this if the user is unable to rotate credentials.
      return $qExtensions.booleanAsPromise(true);
    }

    function onSubmit() {
      spinnerModal.showModalSpinner(gettext('Loading'));
      return magnum.rotateCredential(cluster.id)
        .then(handleResponse)
        .catch(onError)
        .finally(spinnerModal.hideModalSpinner);
    }

    function handleResponse(response) {
      var result = { created: [], deleted: [], failed: [], updated: [] };

      if (!response) {
        return result;
      }

      toast.add('success', getMessage(message.success));
      result = actionResult.getActionResult().updated(resourceType, cluster.id).result;
      return result;
    }

    function onError(response) {
      var msg;
      if (response && response.data) {
        msg = getMessage(message.errorDetail, { reason: response.data });
      } else {
        msg = getMessage(message.error);
      }
      toast.add('error', msg);
    }

    function getMessage(message, params) {
      return interpolate(message, Object.assign(cluster, params), true);
    }
  }
})();
