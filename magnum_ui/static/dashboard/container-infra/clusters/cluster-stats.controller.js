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

  /**
   * @ngdoc controller
   * @name clusterStatsController
   * @ngController
   *
   * @description
   * Controller to show stats and quota charts for cluster in cluster table view
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .controller(
      'horizon.dashboard.container-infra.clusters.clusterStatsController',
      clusterStatsController);

  clusterStatsController.$inject = [
    '$q',
    '$scope',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.userSession'
  ];

  function clusterStatsController($q, $scope, magnum, userSession) {
    var ctrl = this;
    ctrl.chartSettings = {
      innerRadius: 24,
      outerRadius: 48,
      titleClass: "pie-chart-title-medium",
      showTitle: false,
      showLabel: true,
      showLegend: false,
      tooltipIcon: 'fa-square'
    };
    // Chart data is watched by pie-chart directive.
    // So to refresh chart after retrieving data, update whole of 'data' array.
    ctrl.chartDataClusters = {
      maxLimit: 20,
      data: []
    };
    // container for temporal chart data
    var dataClusters = [];
    userSession.get().then(onGetUserSession);

    function onGetUserSession(session) {
      ctrl.projectId = session.project_id;
      magnum.getStats().then(onGetStats);
    }

    function onGetStats(response) {
      ctrl.stats = response.data.stats;
      dataClusters = [
        {label: gettext("Exists"), value: response.data.stats.clusters, colorClass: "exists"},
        {label: gettext("Margin"), value: 20 - response.data.stats.clusters, colorClass: "margin"}
      ];
      magnum.getQuota(ctrl.projectId, "Cluster", true).then(onGetQuotaCluster, onGetQuotaCluster);
    }

    function onGetQuotaCluster(response) {
      // set data for clusters chart
      var sum = dataClusters[0].value;
      var max = dataClusters[1].value;
      max = response.data.hard_limit;
      dataClusters[1].value = max - sum;
      var percent = Math.round(sum / max * 100);
      // shows 100% used if max = 0
      if (max === 0) {
        percent = 100;
      }
      var overMax = percent > 100;
      ctrl.chartDataClusters = {
        title: gettext("Clusters"),
        label: percent + '%',
        maxLimit: max,
        overMax: overMax,
        data: dataClusters
      };
      ctrl.quota = {clusters: max};
    }
  }
})();
