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
    .module('horizon.dashboard.container-infra.cluster-templates')
    .factory('horizon.dashboard.container-infra.cluster-templates.workflow', ClusterTemplateWorkflow);

  ClusterTemplateWorkflow.$inject = [
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext'
  ];

  function ClusterTemplateWorkflow(basePath, workflowService, gettext) {
    return workflowService({
      title: gettext('Create Cluster Template'),
      steps: [
        {
          title: gettext('Info'),
          templateUrl: basePath + 'cluster-templates/create/info/info.html',
          helpUrl: basePath + 'cluster-templates/create/info/info.help.html',
          formName: 'ClusterTemplateInfoForm'
        },
        {
          title: gettext('Node Spec'),
          templateUrl: basePath + 'cluster-templates/create/spec/spec.html',
          helpUrl: basePath + 'cluster-templates/create/spec/spec.help.html',
          formName: 'ClusterTemplateSpecForm'
        },
        {
          title: gettext('Network'),
          templateUrl: basePath + 'cluster-templates/create/network/network.html',
          helpUrl: basePath + 'cluster-templates/create/network/network.help.html',
          formName: 'ClusterTemplateNetworkForm'
        },
        {
          title: gettext('Labels'),
          templateUrl: basePath + 'cluster-templates/create/labels/labels.html',
          helpUrl: basePath + 'cluster-templates/create/labels/labels.help.html',
          formName: 'ClusterTemplateLabelsForm'
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
