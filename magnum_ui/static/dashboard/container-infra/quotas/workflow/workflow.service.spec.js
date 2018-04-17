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

  describe('horizon.dashboard.container-infra.quotas.workflow', function() {

    var workflow, $scope, $q, keystone, deferred;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.quotas'));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      workflow = $injector.get('horizon.dashboard.container-infra.quotas.workflow');
      keystone = $injector.get('horizon.app.core.openstack-service-api.keystone');
      deferred = $q.defer();
      deferred.resolve({data:{items:{1:{name:1},2:{name:2}}}});
      spyOn(keystone, 'getProjects').and.returnValue(deferred.promise);
    }));

    it('should be init', inject(function($timeout) {
      var config = workflow.init('create', 'Create Quota', $scope);
      $timeout.flush();
      expect(config.title).toBeDefined();
      expect(config.schema).toBeDefined();
      expect(config.form).toBeDefined();
      expect(config.model).toBeDefined();
    }));
  });
})();
