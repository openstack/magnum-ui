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

  describe('horizon.dashboard.container-infra.clusters.rotate-credential.service', function() {

    var $q, service, magnum, deferred, spinnerModal, modal, modalConfig, toast, toastState;
    var selected = { id: '1', name: 'mycluster' };

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector, _$q_) {
      $q = _$q_;
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.rotate-credential.service');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      spinnerModal = $injector.get('horizon.framework.widgets.modal-wait-spinner.service');
      modal = $injector.get('horizon.framework.widgets.modal.simple-modal.service');
      toast = $injector.get('horizon.framework.widgets.toast.service');

      spyOn(spinnerModal, 'showModalSpinner').and.callFake(function() {});
      spyOn(spinnerModal, 'hideModalSpinner').and.callFake(function() {});
      spyOn(toast, 'add').and.callFake(function(state) {
        toastState = state;
      });
      spyOn(modal, 'modal').and.callFake(function(config) {
        deferred = $q.defer();
        deferred.resolve(config);
        modalConfig = config;
        return { result: deferred.promise };
      });
    }));

    it('should check the policy', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should open the modal, hide the loading spinner, and rotate credentials',
      inject(function($timeout) {
        deferred = $q.defer();
        deferred.resolve({});
        spyOn(magnum, 'rotateCredential').and.returnValue(deferred.promise);

        service.perform(selected);

        $timeout(function() {
          expect(toast.add).toHaveBeenCalledTimes(1);
          expect(modal.modal).toHaveBeenCalled();
          expect(spinnerModal.showModalSpinner).toHaveBeenCalled();
          expect(spinnerModal.hideModalSpinner).toHaveBeenCalled();
          expect(magnum.rotateCredential).toHaveBeenCalled();
          expect(modalConfig.title).toBeDefined();
          expect(modalConfig.body).toBeDefined();
          expect(modalConfig.submit).toBeDefined();
          expect(toastState).toEqual('success');
        }, 0);
        $timeout.flush();
      })
    );

    it('should open the modal, hide the loading spinner, and handle errors on failed rotation',
      inject(function($timeout) {
        deferred = $q.defer();
        deferred.reject();
        spyOn(magnum, 'rotateCredential').and.returnValue(deferred.promise);

        service.perform(selected);

        $timeout(function () {
          expect(toast.add).toHaveBeenCalledTimes(1);
          expect(modal.modal).toHaveBeenCalled();
          expect(spinnerModal.showModalSpinner).toHaveBeenCalled();
          expect(spinnerModal.hideModalSpinner).toHaveBeenCalled();
          expect(magnum.rotateCredential).toHaveBeenCalled();
          expect(modalConfig.title).toBeDefined();
          expect(modalConfig.body).toBeDefined();
          expect(modalConfig.submit).toBeDefined();
          expect(toastState).toEqual('error');
        }, 0);
        $timeout.flush();
      })
    );
  });
})();
