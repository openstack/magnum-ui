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

  describe('horizon.dashboard.container-infra.quotas.delete.service', function() {

    var service, $scope, deferredModal;

    var deleteModalService = {
      open: function () {
        deferredModal.resolve({
          pass: [{context: {id: 'a'}}],
          fail: [{context: {id: 'b'}}]
        });
        return deferredModal.promise;
      }
    };

    var magnumAPI = {
      deleteQuota: function() {
        return;
      }
    };

    var policyAPI = {
      ifAllowed: function() {
        return {
          success: function(callback) {
            callback({allowed: true});
          }
        };
      }
    };

    beforeEach(module('horizon.dashboard.container-infra.quotas'));

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));

    beforeEach(module('horizon.framework.widgets.modal', function($provide) {
      $provide.value('horizon.framework.widgets.modal.deleteModalService', deleteModalService);
    }));

    beforeEach(module('horizon.app.core.openstack-service-api', function($provide) {
      $provide.value('horizon.app.core.openstack-service-api.magnum', magnumAPI);
      $provide.value('horizon.app.core.openstack-service-api.policy', policyAPI);
      spyOn(policyAPI, 'ifAllowed').and.callThrough();
    }));

    beforeEach(inject(function($injector, _$rootScope_, $q) {
      $scope = _$rootScope_.$new();
      service = $injector.get('horizon.dashboard.container-infra.quotas.delete.service');
      deferredModal = $q.defer();
    }));

    function generateQuota(count) {
      var Quota = [];
      var data = {
        id: '1',
        project_id: 'delete_test',
        resource: 'Cluster',
        hard_limit: 2
      };

      for (var index = 0; index < count; index++) {
        var quotas = angular.copy(data);
        quotas.id = index + 1;
        Quota.push(quotas);
      }
      return Quota;
    }

    describe('perform method', function() {

      beforeEach(function() {
        spyOn(deleteModalService, 'open').and.callThrough();
        service.initAction(labelize);
      });

      function labelize(count) {
        return {
          title: ngettext('title', 'titles', count),
          message: ngettext('message', 'messages', count),
          submit: ngettext('submit', 'submits', count),
          success: ngettext('success', 'successes', count),
          error: ngettext('error', 'errors', count)
        };
      }

      it('should open the delete modal and show correct labels', testSingleObject);

      function testSingleObject() {
        var quotas = generateQuota(1);
        service.perform(quotas[0], $scope);
        $scope.$apply();

        expect(deleteModalService.open).toHaveBeenCalled();
      }

      it('should open the delete modal and show correct labels', testDoubleObject);

      function testDoubleObject() {
        var quotas = generateQuota(2);
        service.perform(quotas, $scope);
        $scope.$apply();

        expect(deleteModalService.open).toHaveBeenCalled();
      }

      it('should pass in a function that deletes a quota', testMagnum);

      function testMagnum() {
        spyOn(magnumAPI, 'deleteQuota');
        var quotas = generateQuota(1);
        var quota = quotas[0];
        service.perform(quotas, $scope);
        $scope.$apply();

        var contextArg = deleteModalService.open.calls.argsFor(0)[2];
        var deleteFunction = contextArg.deleteEntity;
        deleteFunction(quota.id, quota);
      }
    });
  });
})();
