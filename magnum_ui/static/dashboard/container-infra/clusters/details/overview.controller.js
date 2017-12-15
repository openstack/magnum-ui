/*
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function() {
  "use strict";

  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller('ClusterOverviewController', ClusterOverviewController);

  ClusterOverviewController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.magnum'
  ];

  function ClusterOverviewController(
    $scope,
    magnum
  ) {
    var ctrl = this;
    ctrl.cluster = {};
    ctrl.cluster_template = {};
    ctrl.objLen = objLen;

    $scope.context.loadPromise.then(onGetCluster);

    function onGetCluster(cluster) {
      ctrl.cluster = cluster.data;
      magnum.getClusterTemplate(ctrl.cluster.cluster_template_id).then(onGetClusterTemplate);
    }

    function onGetClusterTemplate(clusterTemplate) {
      ctrl.cluster_template = clusterTemplate.data;
    }

    function objLen(obj) {
      var length = 0;
      if (typeof obj === 'object') {
        length = Object.keys(obj).length;
      }
      return length;
    }
  }
})();
