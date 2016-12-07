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

  describe('createClusterTemplateSpecController tests', function() {
    var controller, glance, nova, deferred, KeyDeferred, $q;

    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(inject(function ($injector, _$q_) {
      $q = _$q_;
      controller = $injector.get('$controller');
      glance = $injector.get('horizon.app.core.openstack-service-api.glance');
      nova = $injector.get('horizon.app.core.openstack-service-api.nova');

      deferred = $q.defer();
      deferred.resolve({data:{items:{1:{name:1},2:{name:2}}}});
      KeyDeferred = $q.defer();
      KeyDeferred.resolve({data:{items:{1:{keypair:{name:1}},2:{keypair:{name:2}}}}});

      spyOn(glance, 'getImages').and.returnValue(deferred.promise);
      spyOn(nova, 'getFlavors').and.returnValue(deferred.promise);
      spyOn(nova, 'getKeypairs').and.returnValue(KeyDeferred.promise);

    }));

    function createController(scope) {
      return controller('createClusterTemplateSpecController', {$scope: scope});
    }

    it('should initialise the controller when created', inject(function($timeout) {
      var ctrl = createController({});
      $timeout.flush();
      expect(ctrl.images).toBeDefined();
      expect(ctrl.nflavors).toBeDefined();
      expect(ctrl.mflavors).toBeDefined();
      expect(ctrl.keypairs).toBeDefined();
    }));
  });
})();
