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
  describe('horizon.dashboard.container-infra.clusters', function() {
    var magnum, controller, $scope;

    function fakePromise() {
      return {
        success : angular.noop,
        items : {
          id : ''
        }
      };
    }

    $scope = {
      model: {
        newClusterSpec: {
          id: ''
        }
      }
    };

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function ($injector) {
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      controller = $injector.get('$controller');

      spyOn(magnum, 'getClusterTemplates').and.callFake(fakePromise);
    }));

    function createController($scoped) {
      return controller('createClusterInfoController', {
        $scope: $scoped,
        magnum: magnum
      });
    }

    it('should init() pass', function() {

      createController($scope);
      expect(magnum.getClusterTemplates).toHaveBeenCalled();
    });

    it('should changeClusterTemplate() pass', function() {

      createController($scope);

      $scope.model.newClusterSpec.cluster_template_id = '1';
      $scope.changeClusterTemplate();
      expect($scope.cluster_template_detail.name).toBe('');

      $scope.model.newClusterSpec.cluster_template_id = '';
      $scope.changeClusterTemplate();
      expect($scope.cluster_template_detail.name).toBe('Choose a Cluster Template');

    });

  });
})();
