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
    var testCall, service;
    var apiService = {};
    var toastService = {};

    beforeEach(module('horizon.framework'));
    beforeEach(module('horizon.app.core.openstack-service-api'));

    beforeEach(
      module('horizon.mock.openstack-service-api',
        function($provide, initServices) {
          testCall = initServices($provide, apiService, toastService);
        })
    );

    beforeEach(inject(['horizon.app.core.openstack-service-api.magnum', function(magnumAPI) {
      service = magnumAPI;
    }]));

    it('defines the service', function() {
      expect(service).toBeDefined();
    });

    var tests = [
      {
        "func": "createCluster",
        "method": "post",
        "path": "/api/container_infra/clusters/",
        "data": {
          "name": "New Cluster"
        },
        "error": "Unable to create cluster.",
        "testInput": [
          {
            "name": "New Cluster"
          }
        ]
      },
      {
        "func": "getCluster",
        "method": "get",
        "path": "/api/container_infra/clusters/123",
        "error": "Unable to retrieve the cluster.",
        "testInput": ["123"]
      },
      {
        "func": "getClusterConfig",
        "method": "get",
        "path": "/api/container_infra/clusters/123/config",
        "error": "Unable to retrieve the cluster config.",
        "testInput": ["123"]
      },
      {
        "func": "getClusters",
        "method": "get",
        "path": "/api/container_infra/clusters/",
        "error": "Unable to retrieve the clusters."
      },
      {
        "func": "getClusterNodes",
        "method": "get",
        "path": "/api/container_infra/clusters/123/resize",
        "error": "Unable to get cluster\'s working nodes.",
        "testInput": ["123"]
      },
      {
        "func": "resizeCluster",
        "method": "post",
        "path": "/api/container_infra/clusters/123/resize",
        "data": {
          "node_count": 2,
          "nodes_to_remove": ["456"],
          "nodegroup": "default-worker"
        },
        "error": "Unable to resize given cluster id: 123.",
        "testInput": [
          "123",
          {
            "node_count": 2,
            "nodes_to_remove": ["456"],
            "nodegroup": "default-worker"
          }
        ]
      },
      {
        "func": "deleteCluster",
        "method": "delete",
        "path": "/api/container_infra/clusters/",
        "data": [1],
        "error": "Unable to delete the cluster with id: 1",
        "testInput": [1]
      },
      {
        "func": "upgradeCluster",
        "method": "post",
        "path": "/api/container_infra/clusters/123/upgrade",
        "data": {
          "cluster_template": "ABC",
          "max_batch_size": 1,
          "node_group": "default-worker"
        },
        "error": "Unable to perform rolling upgrade.",
        "testInput": [
          "123",
          {
            "cluster_template": "ABC",
            "max_batch_size": 1,
            "node_group": "default-worker"
          }
        ]
      },
      {
        "func": "deleteClusters",
        "method": "delete",
        "path": "/api/container_infra/clusters/",
        "data": [1,2,3],
        "error": "Unable to delete the clusters.",
        "testInput": [
          [1,2,3]
        ]
      },
      {
        "func": "createClusterTemplate",
        "method": "post",
        "path": "/api/container_infra/cluster_templates/",
        "data": {
          "name": "New Cluster Template"
        },
        "error": "Unable to create cluster template.",
        "testInput": [
          {
            "name": "New Cluster Template"
          }
        ]
      },
      {
        "func": "getClusterTemplate",
        "method": "get",
        "path": "/api/container_infra/cluster_templates/123",
        "error": "Unable to retrieve the cluster template.",
        "testInput": [123]
      },
      {
        "func": "getClusterTemplates",
        "method": "get",
        "path": "/api/container_infra/cluster_templates/",
        "error": "Unable to retrieve the cluster templates."
      },
      {
        "func": "getClusterTemplates",
        "method": "get",
        "path": "/api/container_infra/cluster_templates/?related_to=123",
        "error": "Unable to retrieve the cluster templates.",
        "testInput": [123]
      },
      {
        "func": "deleteClusterTemplate",
        "method": "delete",
        "path": "/api/container_infra/cluster_templates/",
        "data": [1],
        "error": "Unable to delete the cluster template with id: 1",
        "testInput": [1]
      },
      {
        "func": "deleteClusterTemplates",
        "method": "delete",
        "path": "/api/container_infra/cluster_templates/",
        "data": [1,2,3],
        "error": "Unable to delete the cluster templates.",
        "testInput": [
          [1,2,3]
        ]
      },
      {
        "func": "signCertificate",
        "method": "post",
        "path": "/api/container_infra/certificates/",
        "data": {
          "name": "Sign certificate"
        },
        "error": "Unable to sign certificate.",
        "testInput": [
          {
            "name": "Sign certificate"
          }
        ]
      },
      {
        "func": "showCertificate",
        "method": "get",
        "path": "/api/container_infra/certificates/123",
        "error": "Unable to retrieve the certificate.",
        "testInput": [123]
      },
      {
        "func": "rotateCertificate",
        "method": "delete",
        "path": "/api/container_infra/certificates/123",
        "data": [123],
        "error": "Unable to rotate the certificate.",
        "testInput": [123, [123]]
      },
      {
        "func": "getQuotas",
        "method": "get",
        "path": "/api/container_infra/quotas/",
        "error": "Unable to retrieve the quotas."
      },
      {
        "func": "getQuota",
        "method": "get",
        "path": "/api/container_infra/quotas/123/Cluster",
        "error": "Unable to retrieve the quota.",
        "testInput": ["123", "Cluster"]
      },
      {
        "func": "createQuota",
        "method": "post",
        "path": "/api/container_infra/quotas/",
        "data": {
          "project_id": "123",
          "resource": "Cluster",
          "hard_limit": 1
        },
        "error": "Unable to create quota.",
        "testInput": [
          {
            "project_id": "123",
            "resource": "Cluster",
            "hard_limit": 1
          }
        ]
      },
      {
        "func": "updateQuota",
        "method": "patch",
        "path": "/api/container_infra/quotas/123/Cluster",
        "data": {
          "project_id": "123",
          "resource": "Cluster",
          "hard_limit": "1"
        },
        "error": "Unable to update quota.",
        "testInput": [
          "123",
          "Cluster",
          {
            "project_id": "123",
            "resource": "Cluster",
            "hard_limit": "1"
          }
        ]
      },
      {
        "func": "deleteQuota",
        "method": "delete",
        "data": {
          "project_id": "123",
          "resource": "Cluster"
        },
        "path": "/api/container_infra/quotas/123/Cluster",
        "error": "Unable to delete the quota with project id: 123 and resource: Cluster.",
        "testInput": ["123", "Cluster"]
      },
      {
        "func": "getStats",
        "method": "get",
        "path": "/api/container_infra/stats/",
        "error": "Unable to retrieve the stats."
      },
      {
        "func": "getIngressControllers",
        "method": "get",
        "path": "/api/container_infra/ingress_controllers/",
        "error": "Unable to retrieve available ingress controllers."
      },
      {
        "func": "getAddons",
        "method": "get",
        "path": "/api/container_infra/available_addons/",
        "error": "Unable to retrieve available add-ons."
      }
    ];

    // Iterate through the defined tests and apply as Jasmine specs.
    angular.forEach(tests, function(params) {
      it('defines the ' + params.func + ' call properly', function() {
        var callParams = [apiService, service, toastService, params];
        testCall.apply(this, callParams);
      });
    });
  });

})();
