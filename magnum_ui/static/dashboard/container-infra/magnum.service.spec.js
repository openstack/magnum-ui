/*
 *    (c) Copyright 2016 NEC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  'use strict';

  describe('Magnum API', function() {
    var service;

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));

    beforeEach(inject(['horizon.app.core.openstack-service-api.magnum', function(magnumAPI) {
      service = magnumAPI;
    }]));

    it('defines the service', function() {
      expect(service).toBeDefined();
    });
  });

})();
