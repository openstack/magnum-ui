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

  describe('register cluster actions module', function() {
    var registry;
    beforeEach(module('horizon.dashboard.container-infra.clusters.actions'));

    beforeEach(inject(function($injector) {
      registry = $injector.get('horizon.framework.conf.resource-type-registry.service');
    }));

    it('registers Create Cluster as a batch action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').globalActions;
      expect(actionHasId(actions, 'createClusterAction')).toBe(true);
    });

    it('registers Delete Cluster as a batch action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').batchActions;
      expect(actionHasId(actions, 'batchDeleteClusterAction')).toBe(true);
    });

    it('registers Show Certificate as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'showCertificateAction')).toBe(true);
    });

    it('registers Sign Certificate as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'signCertificateAction')).toBe(true);
    });

    it('registers Rotate Certificate as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'rotateCertificateAction')).toBe(true);
    });

    it('registers Resize Cluster as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'resizeClusterAction')).toBe(true);
    });

    it('registers Delete Cluster as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'deleteClusterAction')).toBe(true);
    });

    it('registers Get Cluster Config as an item action', function() {
      var actions = registry.getResourceType('OS::Magnum::Cluster').itemActions;
      expect(actionHasId(actions, 'getClusterConfigAction')).toBe(true);
    });

    function actionHasId(list, value) {
      return list.filter(matchesId).length === 1;

      function matchesId(action) {
        if (action.id === value) {
          return true;
        }
      }
    }

  });
})();
