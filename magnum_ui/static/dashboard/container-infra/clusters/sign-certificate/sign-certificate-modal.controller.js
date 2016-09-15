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
    ctrl.changeFile = changeFile;
    ctrl.model = model;
    ctrl.form = null;
    magnum.getCluster(model.newCertificateSpec.cluster_uuid).success(onGetCluster);

    function onGetCluster(response) {
      ctrl.model.cluster_name = response.name;
    }

    function changeFile(files) {
      // NOTE: this uses on-file-changed directive in Swift-UI included Horizon.
      if (files.length) {
        // load csr file and set into model
        var reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function() {
          model.newCertificateSpec.csr = reader.result;
          ctrl.model.csrfile = files[0];
          ctrl.form.$setDirty();
        };
        // Note that a $scope.$digest() is now needed for the change to the ngModel to be
        // reflected in the page (since this callback is fired from inside a DOM event)
        // but the on-file-changed directive currently does a digest after this callback
        // is invoked.
      } else {
        model.newCertificateSpec.csr = "";
        ctrl.model.csrfile = null;
        ctrl.form.$setPristine();
      }
    }
  }
})();
