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

  describe('horizon.dashboard.container-infra.clusters.resize.service', function() {

    var service, $scope, $q, deferred, magnum, spinnerModal, modalConfig;
    var selected = {
      id: 1
    };
    var modal = {
      open: function(config) {
        deferred = $q.defer();
        deferred.resolve(config);
        modalConfig = config;

        return deferred.promise;
      }
    };

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.framework.widgets.form.ModalFormService', modal);
    }));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.resize.service');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      spinnerModal = $injector.get('horizon.framework.widgets.modal-wait-spinner.service');

      spyOn(spinnerModal, 'showModalSpinner').and.callFake(function() {});
      spyOn(spinnerModal, 'hideModalSpinner').and.callFake(function() {});

      deferred = $q.defer();
      deferred.resolve({data: {uuid: '1'}});
      spyOn(magnum, 'resizeCluster').and.returnValue(deferred.promise);
      spyOn(modal, 'open').and.callThrough();
    }));

    it('should check the policy if the user is allowed to update cluster', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should open the modal, hide the loading spinner and check the form model',
      inject(function($timeout) {
        var mockWorkerNodes = [{id: "456", name: "Worker Node 1"}];

        deferred = $q.defer();
        deferred.resolve({data: {cluster: {}, worker_nodes: mockWorkerNodes}});
        spyOn(magnum, 'getClusterNodes').and.returnValue(deferred.promise);

        service.perform(selected, $scope);

        $timeout(function() {
          expect(modal.open).toHaveBeenCalled();
          expect(spinnerModal.showModalSpinner).toHaveBeenCalled();
          expect(spinnerModal.hideModalSpinner).toHaveBeenCalled();

          // Check if the form's model skeleton is correct
          expect(modalConfig.model.id).toBe(selected.id);
          expect(modalConfig.model.original_node_count).toBe(mockWorkerNodes.length);
          expect(modalConfig.model.node_count).toBe(mockWorkerNodes.length);
          expect(modalConfig.title).toBeDefined();
          expect(modalConfig.schema).toBeDefined();
          expect(modalConfig.form).toBeDefined();
        }, 0);

        $timeout.flush();
        $scope.$apply();
      }));

    it('should not open the modal due to a request error and should hide the loading spinner',
      inject(function($timeout) {
        deferred = $q.defer();
        deferred.reject();
        spyOn(magnum, 'getClusterNodes').and.returnValue(deferred.promise);

        service.perform(selected, $scope);

        $timeout(function() {
          expect(modal.open).not.toHaveBeenCalled();
          expect(spinnerModal.showModalSpinner).toHaveBeenCalled();
          expect(spinnerModal.hideModalSpinner).toHaveBeenCalled();
        }, 0);

        $timeout.flush();
        $scope.$apply();
      }));
  });
})();
