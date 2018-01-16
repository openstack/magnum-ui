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

  describe('horizon.dashboard.container-infra.clusters.sign-certificate.service',
  function() {

    var $q, service, textDownload, deferred, fakeDeferred, model;

    var fakeModal = {
      result: {
        then: function(callback) {
          callback('test');
        }
      }
    };

    var fakesignCertificate = {
      data:{
        pem: ""
      }
    };

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector, _$rootScope_, _$q_, $uibModal) {
      $q = _$q_;
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.sign-certificate.service');
      textDownload = $injector.get('horizon.framework.util.file.text-download');
      deferred = $q.defer();
      deferred.resolve({data: {uuid: 1}});
      spyOn(textDownload, 'downloadTextFile').and.returnValue(deferred.promise);

      model = $injector.get('horizon.dashboard.container-infra.clusters.sign-certificate-model');
      fakeDeferred = $q.defer();
      fakeDeferred.resolve(fakesignCertificate);
      spyOn(model, 'signCertificate').and.returnValue(fakeDeferred.promise);

      spyOn($uibModal, 'open').and.returnValue(fakeModal);
    }));

    it('should pass allow()', function() {
      var allowed = service.allowed();
      expect(allowed).toBeTruthy();
    });

    it('should pass submit() and success()', inject(function($timeout) {

      var selected = {id : 1};
      service.initAction();
      service.perform(selected);
      $timeout.flush();

      expect(model.signCertificate).toHaveBeenCalled();
      expect(textDownload.downloadTextFile).toHaveBeenCalled();

    }));

  });
})();
