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
   * @ngdoc overview
   * @ngname horizon.dashboard.container-infra.clusters.actions
   *
   * @description
   * Provides all of the actions for clusters.
   */
  angular.module('horizon.dashboard.container-infra.clusters.actions',
    [
      'horizon.framework',
      'horizon.dashboard.container-infra'
    ])
    .run(registerClusterActions);

  registerClusterActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.framework.util.i18n.gettext',
    'horizon.dashboard.container-infra.clusters.create.service',
    'horizon.dashboard.container-infra.clusters.delete.service',
    'horizon.dashboard.container-infra.clusters.resize.service',
    'horizon.dashboard.container-infra.clusters.rolling-upgrade.service',
    'horizon.dashboard.container-infra.clusters.show-certificate.service',
    'horizon.dashboard.container-infra.clusters.sign-certificate.service',
    'horizon.dashboard.container-infra.clusters.rotate-certificate.service',
    'horizon.dashboard.container-infra.clusters.config.service',
    'horizon.dashboard.container-infra.clusters.resourceType'
  ];

  function registerClusterActions (
    registry,
    gettext,
    createClusterService,
    deleteClusterService,
    resizeClusterService,
    rollingUpgradeClusterService,
    showCertificateService,
    signCertificateService,
    rotateCertificateService,
    getClusterConfigService,
    resourceType) {

    var clusterResourceType = registry.getResourceType(resourceType);
    clusterResourceType.globalActions
      .append({
        id: 'createClusterAction',
        service: createClusterService,
        template: {
          type: 'create',
          text: gettext('Create Cluster')
        }
      });

    clusterResourceType.batchActions
      .append({
        id: 'batchDeleteClusterAction',
        service: deleteClusterService,
        template: {
          type: 'delete-selected',
          text: gettext('Delete Clusters')
        }
      });

    clusterResourceType.itemActions
      .append({
        id: 'showCertificateAction',
        service: showCertificateService,
        template: {
          text: gettext('Show Certificate')
        }
      })
      .append({
        id: 'signCertificateAction',
        service: signCertificateService,
        template: {
          text: gettext('Sign Certificate')
        }
      })
      .append({
        id: 'rotateCertificateAction',
        service: rotateCertificateService,
        template: {
          text: gettext('Rotate Certificate')
        }
      })
      .append({
        id: 'getClusterConfigAction',
        service: getClusterConfigService,
        template: {
          text: gettext('Get Cluster Config')
        }
      })
      .append({
        id: 'resizeClusterAction',
        service: resizeClusterService,
        template: {
          text: gettext('Resize Cluster')
        }
      })
      .append({
        id: 'rollingUpgradeClusterAction',
        service: rollingUpgradeClusterService,
        template: {
          text: gettext('Rolling Cluster Upgrade')
        }
      })
      .append({
        id: 'deleteClusterAction',
        service: deleteClusterService,
        template: {
          type: 'delete',
          text: gettext('Delete Cluster')
        }
      });
  }

})();
