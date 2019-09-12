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
  describe('horizon.dashboard.container-infra.clusters', function() {
    var magnum, controller, $scope, $q, deferred, templateResponse, MODEL_DEFAULTS;

    function getModelDefaults() {
      return {
        // Props used by the form
        name: '',
        cluster_template_id: '',
        availability_zone: '',
        keypair: '',
        addons: [],

        master_count: null,
        master_flavor_id: '',
        node_count: null,
        flavor_id: '',
        auto_scaling_enabled: false,
        min_node_count: null,
        max_node_count: null,

        create_network: false,
        fixed_network: '',
        floating_ip_enabled: false,
        ingress_controller: '',

        auto_healing_enabled: true,
        labels: '',
        override_labels: false,

        // Utility properties (not actively used in the form,
        // populated dynamically)
        id: null,
        templateLabels: null,
        ingressControllers: null,
        isSingleMasterNode: false
      };
    }

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));
    beforeEach(module('horizon.dashboard.container-infra.clusters'));

    beforeEach(inject(function ($injector, _$rootScope_, _$q_) {
      $q = _$q_;
      $scope = _$rootScope_.$new();
      $scope.model = getModelDefaults();

      MODEL_DEFAULTS = getModelDefaults();
      // Trigger the controller's business logic
      $scope.model.cluster_template_id = '1';
      $scope.model.DEFAULTS = MODEL_DEFAULTS;

      templateResponse = {
        "coe": "kubernetes",
        "docker_storage_driver": "overlay2",
        "docker_volume_size": 20,
        "external_network_id": "f10ad6de-a26d-4c29-8c64-2a7418d47f8f",
        "fixed_network": null,
        "fixed_subnet": null,
        "flavor_id": "c1.c4r8",
        "floating_ip_enabled": false,
        "id": "6f3869a2-4cff-4e59-9e8e-ee03efa26688",
        "image_id": "2beb7301-e8c8-4ac1-a321-c63e919094a9",
        "insecure_registry": null,
        "keypair_id": null,
        "labels": {
          "auto_healing_controller": "magnum-auto-healer",
          "auto_healing_enabled": "true",
          "auto_scaling_enabled": "false",
          "cloud_provider_enabled": "true",
          "cloud_provider_tag": "1.14.0-catalyst",
          "container_infra_prefix": "docker.io/catalystcloud/",
          "etcd_volume_size": "20",
          "heat_container_agent_tag": "stein-dev",
          "ingress_controller": "octavia",
          "k8s_keystone_auth_tag": "v1.15.0",
          "keystone_auth_enabled": "true",
          "kube_dashboard_enabled": "true",
          "kube_tag": "v1.15.6",
          "magnum_auto_healer_tag": "v1.15.0-catalyst.0",
          "master_lb_floating_ip_enabled": "false",
          "octavia_ingress_controller_tag": "1.14.0-catalyst",
          "prometheus_monitoring": "true"
        },
        "master_flavor_id": "c1.c2r4",
        "master_lb_enabled": true,
        "name": "kubernetes-v1.15.6-prod-20191129",
        "network_driver": "calico",
        "no_proxy": null,
        "project_id": "94b566de52f9423fab80ceee8c0a4a23",
        "public": true,
        "registry_enabled": false,
        "server_type": "vm",
        "tls_disabled": false,
        "user_id": "098b4de3d94649f8b9ae5bf5ee59451c",
        "volume_driver": "cinder"
      };

      magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      controller = $injector.get('$controller');
      deferred = $q.defer();
      deferred.resolve({data: templateResponse});
      spyOn(magnum, 'getClusterTemplate').and.returnValue(deferred.promise);
      createController($scope);
    }));

    function createController($scoped) {
      return controller(
        'horizon.dashboard.container-infra.clusters.workflow.clusterTemplateController',
        {
          $scope: $scoped,
          magnum: magnum
        });
    }

    it('should load cluster template', function() {
      expect(magnum.getClusterTemplate).toHaveBeenCalled();
    });

    it('should override some model default properties by values from ' +
      'retrieved cluster template', function() {
      templateResponse.keypair_id = 1;
      templateResponse.master_count = 1;
      templateResponse.master_flavor_id = 'ABC';
      templateResponse.node_count = 1;
      templateResponse.flavor_id = 'ABC';

      var model = $scope.model;
      model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect(model.keypair).toBe(1);
      expect(model.master_count).toBe(1);
      expect(model.master_flavor_id).toEqual('ABC');
      expect(model.node_count).toBe(1);
      expect(model.flavor_id).toEqual('ABC');
    });

    it('should not override some non-default model properties by values ' +
      'from retrieved cluster template', function() {
      var model = $scope.model;

      model.keypair = 99;
      model.master_count = 99;
      model.master_flavor_id = 'XYZ';
      model.node_count = 99;
      model.flavor_id = 'XYZ';

      templateResponse.keypair_id = 1;
      templateResponse.master_count = 1;
      templateResponse.master_flavor_id = 'ABC';
      templateResponse.node_count = 1;
      templateResponse.flavor_id = 'ABC';

      model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect(model.keypair).toBe(99);
      expect(model.master_count).toBe(99);
      expect(model.master_flavor_id).toEqual('XYZ');
      expect(model.node_count).toBe(99);
      expect(model.flavor_id).toEqual('XYZ');
    });

    it('should set number of Master Nodes to 1 if the cluster template ' +
      'response contains negative `master_lb_enabled` flag', function() {
      $scope.model.master_count = 99;
      templateResponse.master_lb_enabled = false;
      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();
      expect($scope.model.master_count).toBe(1);

      $scope.model.master_count = MODEL_DEFAULTS.master_count;
      $scope.model.cluster_template_id = '999'; // Triggers bussines logic revalidation
      $scope.$apply();
      expect($scope.model.master_count).toBe(1);
    });

    it('should not process labels if they are not available in the cluster ' +
      'template response', function() {
      templateResponse.labels = null;
      $scope.model.labels = MODEL_DEFAULTS.labels;
      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect($scope.model.labels).toEqual(MODEL_DEFAULTS.labels);
    });

    it('should always override some model properties by values from ' +
      'retrieved cluster template', function() {
      $scope.model.floating_ip_enabled = !MODEL_DEFAULTS.floating_ip_enabled;
      templateResponse.floating_ip_enabled = !$scope.model.floating_ip_enabled;
      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect($scope.model.floating_ip_enabled).toBe(templateResponse.floating_ip_enabled);
    });

    it('should always override some model\'s properties by values from ' +
      'retrieved cluster template\'s labels', function() {
      var model = $scope.model;

      model.auto_scaling_enabled = true;
      templateResponse.labels.auto_scaling_enabled = 'true';
      model.auto_healing_enabled = true;
      templateResponse.labels.auto_healing_enabled = 'false';
      model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect(model.auto_scaling_enabled).toBe(true);
      expect(model.auto_healing_enabled).toBe(false);
    });

    it('should not fail if the cluster template response is empty', function() {
      templateResponse = {};
      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();
    });

    it('should not fail if the cluster template\'s labels are empty', function() {
      templateResponse = {labels:{}};
      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();
    });

    it('should set the correct Ingress Controller on the model based on the ' +
      'label in cluster template response', function() {
      // Controllers retrieved from the API
      $scope.model.ingressControllers = [
        { name: 'Controller1', labels: { ingress_controller: 'c1'}},
        { name: 'Controller2', labels: { ingress_controller: 'c2'}},
        { name: 'Controller3', labels: { ingress_controller: 'c3'}},
      ];

      templateResponse.labels.ingress_controller = 'c2';

      $scope.model.cluster_template_id = '99'; // Triggers bussines logic revalidation
      $scope.$apply();

      expect($scope.model.ingress_controller.labels.ingress_controller).toBe('c2');
    });
  });
})();
