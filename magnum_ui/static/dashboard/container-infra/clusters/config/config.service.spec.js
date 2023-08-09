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

    var $scope, service, selected, magnum, textDownload;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector) {
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.config.service');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      textDownload = $injector.get('horizon.framework.util.file.text-download');
      spyOn(textDownload, 'downloadTextFile').and.returnValue(Promise.resolve(true));
      $scope = $injector.get('$rootScope');
      selected = {id: '1'};
    }));

    it('should check the policy', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should get magnum.getClusterConfig', function() {
      var returnValue = {data: {cluster_config: "config1"}};
      spyOn(magnum, 'getClusterConfig').and.returnValue(Promise.resolve(returnValue));

      service.initAction();
      var promise = service.perform(selected);
      promise.then(verifyContents);
      $scope.$apply();
      expect(magnum.getClusterConfig).toHaveBeenCalled();
      function verifyContents (contents) {
        expect(contents.created).toBeDefined();
        expect(contents.failed).toEqual([]);
        expect(textDownload.downloadTextFile.calls.count()).toBe(1);
      }
    });

    it('should download', inject(function() {
      var returnValue = {data: {key: "key1", cluster_config: "config1", ca: "ca1", cert: "cert1"}};
      spyOn(magnum, 'getClusterConfig').and.returnValue(Promise.resolve(returnValue));
      service.initAction();
      var promise = service.perform(selected);
      promise.then(verifyContents);
      $scope.$apply();
      expect(magnum.getClusterConfig).toHaveBeenCalled();
      function verifyContents (contents) {
        expect(contents.created).toBeDefined();
        expect(contents.failed).toEqual([]);
        expect(textDownload.downloadTextFile.calls.count()).toBe(4);
      }
    }));

  });
})();
