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
      getCluster: getCluster,
      getClusters: getClusters,
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
      downloadTextAsFile: downloadTextAsFile
    };

    return service;

    //////////////
    // Clusters //
    //////////////

    function createCluster(params) {
      return apiService.post('/api/container_infra/clusters/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to create cluster.'));
        });
    }

    function updateCluster(id, params) {
      return apiService.patch('/api/container_infra/clusters/' + id, params)
        .error(function() {
          toastService.add('error', gettext('Unable to update cluster.'));
        });
    }

    function getCluster(id) {
      return apiService.get('/api/container_infra/clusters/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the cluster.'));
        });
    }

    function getClusters() {
      return apiService.get('/api/container_infra/clusters/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the clusters.'));
        });
    }

    function deleteCluster(id, suppressError) {
      var promise = apiService.delete('/api/container_infra/clusters/', [id]);
      return suppressError ? promise : promise.error(function() {
        var msg = gettext('Unable to delete the cluster with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteClusters(ids) {
      return apiService.delete('/api/container_infra/clusters/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the clusters.'));
        });
    }

    //////////////////////
    // ClusterTemplates //
    //////////////////////

    function createClusterTemplate(params) {
      return apiService.post('/api/container_infra/cluster_templates/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to create cluster template.'));
        });
    }

    function updateClusterTemplate(id, params) {
      return apiService.patch('/api/container_infra/cluster_templates/' + id, params)
        .error(function() {
          toastService.add('error', gettext('Unable to update cluster template.'));
        });
    }

    function getClusterTemplate(id) {
      return apiService.get('/api/container_infra/cluster_templates/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the cluster template.'));
        });
    }

    function getClusterTemplates() {
      return apiService.get('/api/container_infra/cluster_templates/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the cluster templates.'));
        });
    }

    function deleteClusterTemplate(id, suppressError) {
      var promise = apiService.delete('/api/container_infra/cluster_templates/', [id]);
      return suppressError ? promise : promise.error(function() {
        var msg = gettext('Unable to delete the cluster template with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteClusterTemplates(ids) {
      return apiService.delete('/api/container_infra/cluster_templates/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the cluster templates.'));
        });
    }

    //////////////////
    // Certificates //
    //////////////////

    function signCertificate(params) {
      return apiService.post('/api/container_infra/certificates/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to sign certificate.'));
        });
    }

    function showCertificate(id) {
      return apiService.get('/api/container_infra/certificates/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the certificate.'));
        });
    }

    function downloadTextAsFile(text, filename) {
      // create text file as object url
      var blob = new Blob([ text ], { "type" : "text/plain" });
      window.URL = window.URL || window.webkitURL;
      var fileurl = window.URL.createObjectURL(blob);

      // provide text as downloaded file
      $timeout(function() {
        //Update view
        var a = angular.element('<a></a>');
        a.attr("href", fileurl);
        a.attr("download", filename);
        a.attr("target", "_blank");
        angular.element(document.body).append(a);
        a[0].click();
        a.remove();
      }, 0);
    }
  }
}());
