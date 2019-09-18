/**
 * Copyright 2017 NEC Corporation
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

  describe('horizon.dashboard.container-infra.utils.service', function() {

    var service;

    ///////////////////

    beforeEach(module('horizon.dashboard.container-infra'));
    beforeEach(inject(function($injector) {
      service = $injector.get(
        'horizon.dashboard.container-infra.utils.service');
    }));

    it('should compare two semver-based versions strings', function() {
      expect(service.versionCompare('1.2.2','1.2.2')).toBe(0);
      expect(service.versionCompare('1.2.3','1.2.2')).toBe(1);
      expect(service.versionCompare('1.2.2','1.2.3')).toBe(-1);

      expect(service.versionCompare('1.12.2','1.2.2')).toBe(1);
      expect(service.versionCompare('12.1.2','1.3.2')).toBe(1);
      expect(service.versionCompare('1.3.2','1.3.11')).toBe(-1);
    });
  });
})();
