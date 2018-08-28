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

  describe('horizon.dashboard.container-infra.cluster-templates.workflow', function() {

    var workflow, magnum, nova, glance, $q, deferred, keyDeferred;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(inject(function($injector, _$q_) {
      $q = _$q_;
      workflow = $injector.get(
        'horizon.dashboard.container-infra.cluster-templates.workflow');
      nova = $injector.get('horizon.app.core.openstack-service-api.nova');
      glance = $injector.get('horizon.app.core.openstack-service-api.glance');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      deferred = $q.defer();
      deferred.resolve({data:{items:{1:{name:1},2:{name:2}}}});
      keyDeferred = $q.defer();
      keyDeferred.resolve({data:{items:{1:{keypair:{name:1}},2:{keypair:{name:2}}}}});
      spyOn(glance, 'getImages').and.returnValue(deferred.promise);
      spyOn(nova, 'getFlavors').and.returnValue(deferred.promise);
      spyOn(nova, 'getKeypairs').and.returnValue(keyDeferred.promise);
      spyOn(magnum, 'getNetworks').and.returnValue(deferred.promise);
    }));

    it('should be init', inject(function($timeout) {
      var config = workflow.init('create', 'Create Cluster Template');
      $timeout.flush();
      expect(config.title).toBeDefined();
      expect(config.schema).toBeDefined();
      expect(config.form).toBeDefined();
      expect(config.model).toBeDefined();

      config.model.coe = '';
      config.form[0].tabs[0].items[0].items[1].onChange();
      config.model.coe = 'swarm';
      config.form[0].tabs[0].items[0].items[1].onChange();

      config.model.coe = 'swarm-mode';
      config.form[0].tabs[0].items[0].items[1].onChange();
      expect(config.form[0].tabs[2].items[0].items[0].items[0].titleMap[0].value).toEqual('docker');
    }));

  });
})();
