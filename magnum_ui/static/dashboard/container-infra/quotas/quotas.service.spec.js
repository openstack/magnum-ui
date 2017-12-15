/**
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

  describe('quotas service', function() {
    var magnum, service;
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.container-infra.quotas'));
    beforeEach(inject(function($injector) {
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      service = $injector.get('horizon.dashboard.container-infra.quotas.service');
    }));

    describe('getQuotasPromise', function() {
      it("provides a promise", inject(function($q, $timeout) {
        var deferred = $q.defer();
        spyOn(magnum, 'getQuotas').and.returnValue(deferred.promise);
        var result = service.getQuotasPromise({});
        deferred.resolve({
          data:{
            items: [{id: '123', resource: 'Cluster', hard_limit: 5}]
          }
        });
        $timeout.flush();
        expect(magnum.getQuotas).toHaveBeenCalled();
        expect(result.$$state.value.data.items[0].id).toBe('123');
      }));
    });
  });
})();
