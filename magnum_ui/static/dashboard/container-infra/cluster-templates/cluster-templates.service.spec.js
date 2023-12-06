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
    var service, detailRoute;
    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));
    beforeEach(inject(function($injector) {
      service = $injector.get('horizon.dashboard.container-infra.cluster-templates.service');
      detailRoute = $injector.get('horizon.app.core.detailRoute');
    }));

    describe('getClusterTemplatesPromise', function() {
      it("provides a promise", inject(function($q, $injector, $timeout) {
        var magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
        var deferred = $q.defer();
        spyOn(magnum, 'getClusterTemplates').and.returnValue(deferred.promise);
        var result = service.getClusterTemplatesPromise({});
        deferred.resolve({
          data:{
            items: [
              {id: 123, name: 'template1', updated_at: '2020-01-01'},
              {id: 456, name: 'template2', created_at: '2021-12-12'},
            ]
          }
        });
        $timeout.flush();
        expect(magnum.getClusterTemplates).toHaveBeenCalled();
        expect(result.$$state.value.data.items[0].name).toBe('template1');
        expect(result.$$state.value.data.items[0].trackBy).toBe('1232020-01-01');
        expect(result.$$state.value.data.items[1].name).toBe('template2');
        expect(result.$$state.value.data.items[1].trackBy).toBe('4562021-12-12');
      }));
    });

    describe('urlFunction', function() {
      it("get url", inject(function() {
        var result = service.urlFunction({id:"123abc"});
        expect(result).toBe(detailRoute + "OS::Magnum::ClusterTemplate/123abc");
      }));
    });

  });

})();
