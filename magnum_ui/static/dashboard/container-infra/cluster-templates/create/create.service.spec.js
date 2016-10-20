/**
 *    (c) Copyright 2016 NEC Corporation
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

  describe('horizon.dashboard.container-infra.cluster-templates.create.service', function() {

    var service, $scope, $q, deferred, deferredModal, magnum;

    var wizardModalService = {
      modal: function (config) {
        deferredModal = $q.defer();
        deferredModal.resolve(config.scope.model);
        return {result: deferredModal.promise};
      }
    };

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.framework.widgets.modal.wizard-modal.service', wizardModalService);
    }));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      service = $injector.get('horizon.dashboard.container-infra.cluster-templates.create.service');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      deferred = $q.defer();
      deferred.resolve({data: {uuid: 1}});
      spyOn(magnum, 'createClusterTemplate').and.returnValue(deferred.promise);
    }));

    it('should check the policy if the user is allowed to create cluster template', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('open the modal and should destroy event watchers', function() {
      spyOn(wizardModalService, 'modal').and.callThrough();
      service.initScope($scope);
      service.perform();

      $scope.$emit('$destroy');

      expect(wizardModalService.modal).toHaveBeenCalled();

      var modalArgs = wizardModalService.modal.calls.argsFor(0)[0];
      expect(modalArgs.scope).toEqual($scope);
      expect(modalArgs.workflow).toBeDefined();
      expect(modalArgs.submit).toBeDefined();

    });

    it('should submit create', inject(function($timeout) {

      spyOn(wizardModalService, 'modal').and.callThrough();

      service.initScope($scope);
      service.perform();
      var modalArgs = wizardModalService.modal.calls.argsFor(0)[0];
      modalArgs.submit();
      $timeout.flush();
      $scope.$apply();

      expect(magnum.createClusterTemplate).toHaveBeenCalled();

    }));
  });
})();
