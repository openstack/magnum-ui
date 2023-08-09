/**
 * Copyright 2015, Cisco Systems
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
(function () {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.magnum', MagnumAPI);

  MagnumAPI.$inject = [
    '$timeout',
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.util.i18n.gettext'
  ];

  function MagnumAPI($timeout, apiService, toastService, gettext) {
    var service = {
      createCluster: createCluster,
      updateCluster: updateCluster,
      upgradeCluster: upgradeCluster,
      getCluster: getCluster,
      getClusterConfig: getClusterConfig,
      getClusters: getClusters,
      getClusterNodes: getClusterNodes,
      resizeCluster: resizeCluster,
      deleteCluster: deleteCluster,
      deleteClusters: deleteClusters,
      createClusterTemplate: createClusterTemplate,
      updateClusterTemplate: updateClusterTemplate,
      getClusterTemplate: getClusterTemplate,
      getClusterTemplates: getClusterTemplates,
      deleteClusterTemplate: deleteClusterTemplate,
      deleteClusterTemplates: deleteClusterTemplates,
      showCertificate: showCertificate,
      signCertificate: signCertificate,
      rotateCertificate: rotateCertificate,
      getStats: getStats,
      getIngressControllers: getIngressControllers,
      getAddons: getAddons,
      getQuotas: getQuotas,
      getQuota: getQuota,
      createQuota: createQuota,
      updateQuota: updateQuota,
      deleteQuota: deleteQuota,
      getNetworks: getNetworks
    };

    return service;

    //////////////
    // Clusters //
    //////////////

    function createCluster(params) {
      return apiService.post('/api/container_infra/clusters/', params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to create cluster.'));
        });
    }

    function updateCluster(id, params) {
      return apiService.patch('/api/container_infra/clusters/' + id, params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to update cluster.'));
        });
    }

    function upgradeCluster(id, params) {
      return apiService.post('/api/container_infra/clusters/' + id + '/upgrade', params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to perform rolling upgrade.'));
        });
    }

    function getCluster(id) {
      return apiService.get('/api/container_infra/clusters/' + id)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the cluster.'));
        });
    }

    function getClusterConfig(id) {
      return apiService.get('/api/container_infra/clusters/' + id + '/config')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the cluster config.'));
        });
    }

    function getClusters() {
      return apiService.get('/api/container_infra/clusters/')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the clusters.'));
        });
    }

    function getClusterNodes(id) {
      return apiService.get('/api/container_infra/clusters/' + id + '/resize')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to get cluster\'s working nodes.'));
        });
    }

    function resizeCluster(id, params) {
      return apiService.post('/api/container_infra/clusters/' + id + '/resize', params)
        .catch(function onError() {
          var msg = gettext('Unable to resize given cluster id: %(id)s.');
          toastService.add('error', interpolate(msg, { id: id }, true));
        });
    }

    function deleteCluster(id, suppressError) {
      var promise = apiService.delete('/api/container_infra/clusters/', [id]);
      return suppressError ? promise : promise.catch(function onError() {
        var msg = gettext('Unable to delete the cluster with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteClusters(ids) {
      return apiService.delete('/api/container_infra/clusters/', ids)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to delete the clusters.'));
        });
    }

    //////////////////////
    // ClusterTemplates //
    //////////////////////

    function createClusterTemplate(params) {
      return apiService.post('/api/container_infra/cluster_templates/', params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to create cluster template.'));
        });
    }

    function updateClusterTemplate(id, params) {
      return apiService.patch('/api/container_infra/cluster_templates/' + id, params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to update cluster template.'));
        });
    }

    function getClusterTemplate(id) {
      return apiService.get('/api/container_infra/cluster_templates/' + id)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the cluster template.'));
        });
    }

    function getClusterTemplates(relatedTemplateId) {
      var filterQuery = relatedTemplateId ? '?related_to=' + relatedTemplateId : '';
      return apiService.get('/api/container_infra/cluster_templates/' + filterQuery)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the cluster templates.'));
        });
    }

    function deleteClusterTemplate(id, suppressError) {
      var promise = apiService.delete('/api/container_infra/cluster_templates/', [id]);
      return suppressError ? promise : promise.catch(function onError() {
        var msg = gettext('Unable to delete the cluster template with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteClusterTemplates(ids) {
      return apiService.delete('/api/container_infra/cluster_templates/', ids)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to delete the cluster templates.'));
        });
    }

    //////////////////
    // Certificates //
    //////////////////

    function signCertificate(params) {
      return apiService.post('/api/container_infra/certificates/', params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to sign certificate.'));
        });
    }

    function showCertificate(id) {
      return apiService.get('/api/container_infra/certificates/' + id)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the certificate.'));
        });
    }

    function rotateCertificate(id) {
      return apiService.delete('/api/container_infra/certificates/' + id, [id])
        .catch(function onError() {
          toastService.add('error', gettext('Unable to rotate the certificate.'));
        });
    }

    ///////////
    // Stats //
    ///////////

    function getStats() {
      return apiService.get('/api/container_infra/stats/')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the stats.'));
        });
    }

    /////////////////
    // Ingress     //
    // Controllers //
    /////////////////

    function getIngressControllers() {
      return apiService.get('/api/container_infra/ingress_controllers/')
        .catch(function onError() {
          toastService.add('error',
            gettext('Unable to retrieve available ingress controllers.'));
        });
    }

    //////////////
    // Add-Ons //
    //////////////

    function getAddons() {
      return apiService.get('/api/container_infra/available_addons/')
        .catch(function onError() {
          toastService.add('error',
            gettext('Unable to retrieve available add-ons.'));
        });
    }

    //////////////
    // Quotas //
    //////////////

    function getQuotas() {
      return apiService.get('/api/container_infra/quotas/')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the quotas.'));
        });
    }

    function getQuota(projectId, resource, suppressError) {
      var promise = apiService.get('/api/container_infra/quotas/' + projectId + '/' + resource);
      return suppressError ? promise : promise.catch(function onError() {
        toastService.add('error', gettext('Unable to retrieve the quota.'));
      });
    }

    function createQuota(params) {
      return apiService.post('/api/container_infra/quotas/', params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to create quota.'));
        });
    }

    function updateQuota(projectId, resource, params) {
      return apiService.patch('/api/container_infra/quotas/' + projectId + '/' + resource, params)
        .catch(function onError() {
          toastService.add('error', gettext('Unable to update quota.'));
        });
    }

    function deleteQuota(projectId, resource, suppressError) {
      var promise = apiService.delete('/api/container_infra/quotas/' + projectId + '/' + resource,
        {project_id: projectId, resource: resource});
      return suppressError ? promise : promise.catch(function onError() {
        var msg = gettext('Unable to delete the quota with project id: %(projectId)s and ' +
          'resource: %(resource)s.');
        toastService.add('error',
          interpolate(msg, { projectId: projectId, resource: resource }, true));
      });
    }

    //////////////////
    // Networks     //
    //////////////////

    /**
     * @name getNetworks
     * @description
     * Get a list of networks for a tenant including external and private.
     * Also, each network has subnets.
     * @returns {Object} An object with property "items". Each item is a network.
     */
    function getNetworks() {
      return apiService.get('/api/container_infra/networks/')
        .catch(function onError() {
          toastService.add('error', gettext('Unable to retrieve the networks.'));
        });
    }
  }
}());
