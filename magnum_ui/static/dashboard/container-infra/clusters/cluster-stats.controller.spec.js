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
    var magnum, userSession, controller, $scope, $q, deferredSession, deferred, deferredQuota;

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function ($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      userSession = $injector.get('horizon.app.core.openstack-service-api.userSession');
      controller = $injector.get('$controller');
      deferredSession = $q.defer();
      deferredSession.resolve({project_id: "1"});
      spyOn(userSession, 'get').and.returnValue(deferredSession.promise);
      deferred = $q.defer();
      deferred.resolve({data: {stats: {clusters: 1}}});
      spyOn(magnum, 'getStats').and.returnValue(deferred.promise);
      createController($scope);
    }));

    function createController($scoped) {
      return controller(
        'horizon.dashboard.container-infra.clusters.clusterStatsController',
        {
          $q: $q,
          $scope: $scoped,
          magnum: magnum,
          userSession: userSession
        });
    }

    it('should load user session', function() {
      expect(userSession.get).toHaveBeenCalled();
    });

    it('should load stats and quotas', function() {
      deferredQuota = $q.defer();
      deferredQuota.resolve({data: {hard_limit: 20}});
      spyOn(magnum, 'getQuota').and.returnValue(deferredQuota.promise);

      $scope.$apply();
      expect(magnum.getStats).toHaveBeenCalled();
      expect(magnum.getQuota).toHaveBeenCalled();
    });

    it('should load stats and zero quota', function() {
      deferredQuota = $q.defer();
      deferredQuota.resolve({data: {hard_limit: 0}});
      spyOn(magnum, 'getQuota').and.returnValue(deferredQuota.promise);

      $scope.$apply();
      expect(magnum.getStats).toHaveBeenCalled();
      expect(magnum.getQuota).toHaveBeenCalled();
    });
  });
})();
