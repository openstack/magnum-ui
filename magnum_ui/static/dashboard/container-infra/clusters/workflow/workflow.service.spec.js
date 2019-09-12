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

  describe('horizon.dashboard.container-infra.clusters.workflow', function() {
    var workflow, magnum, nova, neutron, $scope, $q, deferred, keyDeferred, controllersDeferred,
      controllersResponse, networkDeferred, zoneDeferred, addonsResponse, addonDeferred;

    beforeEach(module('horizon.app.core'));
    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();

      workflow = $injector.get(
        'horizon.dashboard.container-infra.clusters.workflow');
      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      neutron = $injector.get('horizon.app.core.openstack-service-api.neutron');
      nova = $injector.get('horizon.app.core.openstack-service-api.nova');

      deferred = $q.defer();
      deferred.resolve({data:{items:{1:{name:1},2:{name:2}}}});

      keyDeferred = $q.defer();
      keyDeferred.resolve({data:{items:{1:{keypair:{name:1}},2:{keypair:{name:2}}}}});

      controllersResponse = {controllers:[
        {name: 'Controller1', labels:{ingress_controller:'ic1'}},
        {name: 'Controller2', labels:{ingress_controller:'ic2'}},
        {name: 'Controller3', labels:{ingress_controller:'ic3'}},
      ]};
      controllersDeferred = $q.defer();
      controllersDeferred.resolve({data: controllersResponse});

      networkDeferred = $q.defer();
      networkDeferred.resolve({data:{items:[
        {id: '1', name: 'Network1'},
        {id: '2', name: 'Network2'}
      ]}});

      zoneDeferred = $q.defer();
      zoneDeferred.resolve({data:{items:[
        {zoneName: 'zone1'},
        {zoneName: 'zone2'}
      ]}});

      addonsResponse = {addons:[
        {name: 'Addon1', labels:{}, selected: false},
        {name: 'Addon2', labels:{}, selected: true},
        {name: 'Addon3', labels:{}, selected: true},
      ]};
      addonDeferred = $q.defer();
      addonDeferred.resolve({data: addonsResponse});

      spyOn(magnum, 'getClusterTemplates').and.returnValue(deferred.promise);
      spyOn(magnum, 'getIngressControllers').and.returnValue(controllersDeferred.promise);
      spyOn(magnum, 'getAddons').and.returnValue(addonDeferred.promise);
      spyOn(nova, 'getAvailabilityZones').and.returnValue(zoneDeferred.promise);
      spyOn(nova, 'getFlavors').and.returnValue(deferred.promise);
      spyOn(nova, 'getKeypairs').and.returnValue(keyDeferred.promise);
      spyOn(neutron, 'getNetworks').and.returnValue(networkDeferred.promise);
    }));

    it('should be initialised', inject(function($timeout) {
      var config;

      workflow.init('Create Cluster', $scope).then(function(conf) {
        config = conf;
      });

      $timeout.flush();

      expect(config.title).toBeDefined();
      expect(config.schema).toBeDefined();
      expect(config.form).toBeDefined();
      expect(config.model).toBeDefined();
      expect($scope.model).toBeDefined();
      expect($scope.model.DEFAULTS).toBeDefined();

      expect(config.model.ingressControllers).toBe(controllersResponse.controllers);
      expect(config.model.addons.length).toBe(2);
    }));

  });
})();
