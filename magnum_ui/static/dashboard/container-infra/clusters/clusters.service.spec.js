/*
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  describe('cluster templates service', function() {
    var service, detailRoute, magnum;
    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));
    beforeEach(inject(function($injector) {
      service = $injector.get('horizon.dashboard.container-infra.clusters.service');
      detailRoute = $injector.get('horizon.app.core.detailRoute');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
    }));

    describe('getClustersPromise', function() {
      it("provides a promise", inject(function($q, $injector, $timeout) {
        var deferred = $q.defer();
        spyOn(magnum, 'getClusters').and.returnValue(deferred.promise);
        var result = service.getClustersPromise({});
        deferred.resolve({
          data:{
            items: [{id: 123, name: 'cluster1'}]
          }
        });
        $timeout.flush();
        expect(magnum.getClusters).toHaveBeenCalled();
        expect(result.$$state.value.data.items[0].name).toBe('cluster1');
      }));

      it("provides a promise with updated_at", inject(function($q, $injector, $timeout) {
        var deferred = $q.defer();
        spyOn(magnum, 'getClusters').and.returnValue(deferred.promise);
        var result = service.getClustersPromise({});
        deferred.resolve({
          data:{
            items: [{id: 123, name: 'cluster1', updated_at: '2017-01-16'}]
          }
        });
        $timeout.flush();
        expect(magnum.getClusters).toHaveBeenCalled();
        expect(result.$$state.value.data.items[0].name).toBe('cluster1');
      }));
    });

    describe('urlFunction', function() {
      it("get url", inject(function() {
        var result = service.urlFunction({id:"123abc"});
        expect(result).toBe(detailRoute + "OS::Magnum::Cluster/123abc");
      }));
    });
  });
})();
