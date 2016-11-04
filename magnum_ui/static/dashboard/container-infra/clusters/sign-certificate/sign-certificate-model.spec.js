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

  describe('horizon.dashboard.container-infra.cluster-templates.model', function() {
    var certificate;

    beforeEach(module('horizon.dashboard.container-infra.clusters'));
    beforeEach(inject(function($injector) {
      certificate = $injector.get(
        'horizon.dashboard.container-infra.clusters.sign-certificate-model');
    }));

    it('should be init CertificateModel', function() {
      var clusterId = 1;
      certificate.init(clusterId);
      expect(certificate.newCertificateSpec.cluster_uuid).toEqual(clusterId);
    });

    it('signCertificate', inject(function($q, $injector) {
      var magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      var deferred = $q.defer();
      spyOn(magnum, 'signCertificate').and.returnValue(deferred.promise);

      certificate.init(null);
      certificate.signCertificate();
      expect(magnum.signCertificate).toHaveBeenCalled();
    }));

  });
})();
