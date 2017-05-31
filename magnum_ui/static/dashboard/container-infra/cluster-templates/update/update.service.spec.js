/**
 * Copyright 2017 NEC Corporation
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

  describe('horizon.dashboard.container-infra.cluster-templates.update.service', function() {

    var service, $scope, $q, deferred, magnum;
    var selected = {
      id: 1
    };
    var model = {
      id: 1,
      tabs: "",
      keypair_id: "",
      coe: null
    };
    var modal = {
      open: function(config) {
        config.model = model;
        deferred = $q.defer();
        deferred.resolve(config);
        return deferred.promise;
      }
    };
    var workflow = {
      init: function (action, title) {
        action = title;
        return {model: model};
      },
      update: function () {
      }
    };

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(module(function($provide) {
      $provide.value('horizon.dashboard.container-infra.cluster-templates.workflow', workflow);
      $provide.value('horizon.framework.widgets.form.ModalFormService', modal);
    }));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      service = $injector.get(
        'horizon.dashboard.container-infra.cluster-templates.update.service');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      deferred = $q.defer();
      deferred.resolve({data: {uuid: 1, labels: "key1:val1,key2:val2"}});
      spyOn(magnum, 'getClusterTemplate').and.returnValue(deferred.promise);
      spyOn(magnum, 'updateClusterTemplate').and.returnValue(deferred.promise);
      spyOn(workflow, 'init').and.returnValue({model: model});
      spyOn(workflow, 'update').and.callThrough();
      spyOn(modal, 'open').and.callThrough();
    }));

    it('should check the policy if the user is allowed to update cluster template', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('open the modal', inject(function($timeout) {
      service.perform(selected, $scope);

      expect(workflow.init).toHaveBeenCalled();

      expect(modal.open).toHaveBeenCalledWith({model: model});

      $timeout.flush();
      $scope.$apply();

      expect(magnum.updateClusterTemplate).toHaveBeenCalled();
    }));
  });
})();
