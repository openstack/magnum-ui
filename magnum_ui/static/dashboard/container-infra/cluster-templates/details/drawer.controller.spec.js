/**
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

  describe('cluster template drawer controller', function() {

    var ctrl;

    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));

    beforeEach(inject(function($controller) {
      ctrl = $controller('horizon.dashboard.container-infra.cluster-templates.DrawerController',
        {});
    }));

    it('objLen returns number of attributes of object', inject(function() {
      expect(ctrl.objLen(undefined)).toBe(0);
      expect(ctrl.objLen({a: 0})).toBe(1);
    }));
  });
})();
