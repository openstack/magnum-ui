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
  describe('horizon.dashboard.container-infra.clusters', function() {
    var magnum, controller, $scope, $q, deferred;

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function ($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      $scope.model = {
        cluster_template_id: '1',
        keypair: ''
      };
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      controller = $injector.get('$controller');
      deferred = $q.defer();
      deferred.resolve({data: {keypair_id: '1'}});
      spyOn(magnum, 'getClusterTemplate').and.returnValue(deferred.promise);
      createController($scope);
    }));

    function createController($scoped) {
      return controller(
        'horizon.dashboard.container-infra.clusters.workflow.clusterTemplateController',
        {
          $scope: $scoped,
          magnum: magnum
        });
    }

    it('should load cluster template', function() {
      expect(magnum.getClusterTemplate).toHaveBeenCalled();
    });

    it('should keypair is changed by cluster template\'s keypair', function() {
      $scope.model.cluster_template_id = '1';
      $scope.$apply();
      expect($scope.model.keypair).toBe('1');

      $scope.model.cluster_template_id = '';
      $scope.$apply();
      expect($scope.model.keypair).toBe('');
    });
  });
})();
