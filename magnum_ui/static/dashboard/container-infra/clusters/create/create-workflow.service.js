/**
 * Copyright 2015 Cisco Systems, Inc.
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

  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.workflow', ClusterWorkflow);

  ClusterWorkflow.$inject = [
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext'
  ];

  function ClusterWorkflow(basePath, workflowService, gettext) {
    return workflowService({
      title: gettext('Create Cluster'),
      steps: [
        {
          title: gettext('Info'),
          templateUrl: basePath + 'clusters/create/info/info.html',
          helpUrl: basePath + 'clusters/create/info/info.help.html',
          formName: 'clusterInfoForm'
        },
        {
          title: gettext('Size'),
          templateUrl: basePath + 'clusters/create/size/size.html',
          helpUrl: basePath + 'clusters/create/size/size.help.html',
          formName: 'clusterSizeForm'
        },
        {
          title: gettext('Misc'),
          templateUrl: basePath + 'clusters/create/misc/misc.html',
          helpUrl: basePath + 'clusters/create/misc/misc.help.html',
          formName: 'clusterMiscForm'
        }
      ],

      btnText: {
        finish: gettext('Create')
      },

      btnIcon: {
        finish: 'fa fa-check'
      }
    });
  }
})();
