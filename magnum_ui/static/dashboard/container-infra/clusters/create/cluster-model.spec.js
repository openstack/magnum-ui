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

  describe('horizon.dashboard.container-infra.clusters.model', function() {
    var model, specModel;

    specModel = {
      name: null,
      cluster_template_id: null,
      master_count: null,
      node_count: null,
      discover_url: null,
      create_timeout: null,
      keypair: null
    };

    beforeEach(module('horizon.dashboard.container-infra.clusters'));
    beforeEach(inject(function($injector) {
      model = $injector.get('horizon.dashboard.container-infra.clusters.model');
    }));

    it('newClusterSpec', testTemplateModel);

    function testTemplateModel() {
      model.init();
      expect(specModel).toEqual(model.newClusterSpec);
    }

    it('createClusterTemplate', inject(function($q, $injector) {
      var magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      var deferred = $q.defer();
      spyOn(magnum, 'createCluster').and.returnValue(deferred.promise);

      model.init();
      model.createCluster();
      expect(magnum.createCluster).toHaveBeenCalled();

      model.newClusterSpec.name = 'notnull';
      model.createCluster();
      expect(magnum.createCluster).toHaveBeenCalled();

    }));
  });
})();
