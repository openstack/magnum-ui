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
   * @ngdoc controller
   * @name horizon.dashboard.container-infra.clusters.signCertificateController
   * @ngController
   *
   * @description
   * Controller for the container-infra cluster in sign certificate modal
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller(
      'horizon.dashboard.container-infra.clusters.signCertificateController',
      signCertificateController);

  signCertificateController.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.dashboard.container-infra.clusters.sign-certificate-model'
  ];

  function signCertificateController(magnum, model) {
    var ctrl = this;
    ctrl.model = model;
    ctrl.form = null;
    ctrl.title = gettext("CSR");
    magnum.getCluster(model.newCertificateSpec.cluster_uuid).then(onGetCluster);

    function onGetCluster(response) {
      ctrl.model.cluster_name = response.name;
    }
  }
})();
