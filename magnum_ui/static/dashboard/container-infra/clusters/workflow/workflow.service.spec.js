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

  describe('horizon.dashboard.container-infra.clusters.workflow', function() {

    var workflow, magnum, nova, $scope, $q, deferred, keyDeferred;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      workflow = $injector.get(
        'horizon.dashboard.container-infra.clusters.workflow');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      nova = $injector.get('horizon.app.core.openstack-service-api.nova');
      deferred = $q.defer();
      deferred.resolve({data:{items:{1:{name:1},2:{name:2}}}});
      keyDeferred = $q.defer();
      keyDeferred.resolve({data:{items:{1:{keypair:{name:1}},2:{keypair:{name:2}}}}});
      spyOn(magnum, 'getClusterTemplates').and.returnValue(deferred.promise);
      spyOn(nova, 'getKeypairs').and.returnValue(keyDeferred.promise);

    }));

    it('should be init', inject(function($timeout) {
      var config = workflow.init('create', 'Create Cluster', $scope);
      $timeout.flush();
      expect(config.title).toBeDefined();
      expect(config.schema).toBeDefined();
      expect(config.form).toBeDefined();
      expect(config.model).toBeDefined();
    }));

  });
})();
