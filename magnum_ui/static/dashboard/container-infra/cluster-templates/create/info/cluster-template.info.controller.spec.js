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

  describe('createClusterTemplateInfoController tests', function() {
    var controller;

    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(inject(function ($injector) {
      controller = $injector.get('$controller');
    }));

    function createController(scope) {
      return controller('createClusterTemplateInfoController', {$scope: scope});
    }

    it('should initialise the controller coes when created', function() {
      var ctrl = createController({});
      expect(ctrl.coes).toBeDefined();
      expect(ctrl.coes[2].name).toEqual('kubernetes');
      expect(ctrl.coes[2].label).toEqual('Kubernetes');
    });

    it('should initialise the controller supportedNetworkDrivers when created', function() {
      var ctrl = createController({});
      expect(ctrl.supportedNetworkDrivers).toBeDefined();
    });

    it('should initialise the controller supportedVolumeDrivers when created', function() {
      var ctrl = createController({});
      expect(ctrl.supportedVolumeDrivers).toBeDefined();
    });

    it('should initialise the controller $scope when created', function() {
      var scope = {
        model: {
          newClusterTemplateSpec: {
            coe: 'kubernetes'
          }
        }
      };
      createController(scope);
      expect(scope.changeCoes).toBeDefined();
      scope.changeCoes();
      expect(scope.model.newClusterTemplateSpec.network_driver).toEqual('flannel');
      expect(scope.model.newClusterTemplateSpec.volume_driver).toEqual('');
    });

    it('should initialise the controller $scope when created', function() {
      var scope = {
        model: {
          newClusterTemplateSpec: {}
        }
      };
      createController(scope);
      expect(scope.changeCoes).toBeDefined();
      scope.changeCoes();
      expect(scope.model.newClusterTemplateSpec.network_driver).toEqual('');
      expect(scope.model.newClusterTemplateSpec.volume_driver).toEqual('');
    });
  });
})();
