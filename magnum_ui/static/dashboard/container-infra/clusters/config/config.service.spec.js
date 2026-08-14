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

  describe('horizon.dashboard.container-infra.clusters.config.service', function() {

    var service, selected, testWindow;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));
    beforeEach(module(function($provide) {
      testWindow = {location: {assign: jasmine.createSpy('assign')}};
      $provide.value('$window', testWindow);
    }));

    beforeEach(inject(function($injector) {
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.config.service');
      selected = {id: 'cluster-id', name: 'test'};
    }));

    it('should check the policy', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should navigate to the cluster config download', function() {
      service.initAction();
      var result = service.perform(selected);

      expect(testWindow.location.assign).toHaveBeenCalledWith(
        '/api/container_infra/clusters/cluster-id/config/download');
      expect(result.created).toBeDefined();
      expect(result.failed).toEqual([]);
    });

  });
})();
