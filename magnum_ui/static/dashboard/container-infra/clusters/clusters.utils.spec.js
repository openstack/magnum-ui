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

  describe('horizon.dashboard.container-infra.clusters.utils', function() {

    var service, $scope, mockDirective, actionsDirectiveLinkFn, attrs;

    ///////////////////

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector, _$rootScope_) {
      $scope = _$rootScope_.$new();
      service = $injector.get(
        'horizon.dashboard.container-infra.clusters.utils');

      mockDirective = {link:{apply:function() {}}};
      actionsDirectiveLinkFn = service.getActionsDirectiveLinkFn(mockDirective);
      attrs = {
        type: 'row',
        item: 'item',
        allowed: 'allowed'
      };
    }));

    it('should not amend the <actions> directive because the action type is ' +
      'not \'row\'', function() {
      attrs.type = 'main';
      actionsDirectiveLinkFn($scope, angular.element(""), attrs);
    });

    it('should attempt to amend the <actions> directive without critical failure', function() {
      $scope.allowed = [];
      actionsDirectiveLinkFn($scope, angular.element(""), attrs);
    });

  });
})();
