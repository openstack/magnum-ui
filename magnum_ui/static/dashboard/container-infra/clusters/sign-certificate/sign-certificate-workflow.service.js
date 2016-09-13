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

  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller('horizon.dashboard.container-infra.clusters.sign-certificate-modal', SignCertificateModal);

  SignCertificateModal.$inject = [
    '$modal',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.widgets.modal-wait-spinner.service',
    'horizon.framework.widgets.toast.service',
    'horizon.dashboard.container-infra.basePath'
  ];

  function SignCertificateModal(modal, gettext, spinner, toast, basePath) {
    var ctrl = this;

    ctrl.model = {
      cluster: model.cluster_id,
      view_file: null,      // file object managed by angular form ngModel
      upload_file: null,    // file object from the DOM element with the actual upload
      DELIMETER: model.DELIMETER
    };
    ctrl.form = null;       // set by the HTML
    ctrl.changeFile = changeFile;

    ///////////

    function changeFile(files) {
      if (files.length) {
        // update the upload file & its name
        ctrl.model.upload_file = files[0];
        ctrl.model.name = files[0].name;
        ctrl.form.name.$setDirty();

        // Note that a $scope.$digest() is now needed for the change to the ngModel to be
        // reflected in the page (since this callback is fired from inside a DOM event)
        // but the on-file-changed directive currently does a digest after this callback
        // is invoked.
      }
    }  }
})();
