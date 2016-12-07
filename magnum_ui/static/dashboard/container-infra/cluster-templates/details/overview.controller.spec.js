/**
 * (c) Copyright 2016 NEC Corporation.
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

  describe('cluster template overview controller', function() {

    var ctrl, glance, deferred;

    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(inject(function($controller, $q, $injector) {
      glance = $injector.get('horizon.app.core.openstack-service-api.glance');
      deferred = $q.defer();
      deferred.resolve({data: {image_id: 1, items: {1: {name: 1, id: 1},2: {name: 2, id: 2}}}});
      spyOn(glance, 'getImages').and.returnValue(deferred.promise);
      ctrl = $controller('ClusterTemplateOverviewController',
        {
          '$scope' : {context : {loadPromise: deferred.promise}}
        }
      );
    }));

    it('sets ctrl', inject(function($timeout) {
      $timeout.flush();
      expect(ctrl.cluster_template).toBeDefined();
      expect(ctrl.image_uuid).toBeDefined();
    }));

  });
})();
