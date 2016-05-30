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
    .module('horizon.dashboard.container-infra.baymodels')
    .factory('horizon.dashboard.container-infra.baymodels.workflow', baymodelWorkflow);

  baymodelWorkflow.$inject = [
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext'
  ];

  function baymodelWorkflow(basePath, dashboardWorkflow, gettext) {
    return dashboardWorkflow({
      title: gettext('Create Baymodel'),

      steps: [
        {
          title: gettext('Info'),
          templateUrl: basePath + 'baymodels/create/info/info.html',
          helpUrl: basePath + 'baymodels/create/info/info.help.html',
          formName: 'baymodelInfoForm'
        },
        {
          title: gettext('Node Spec'),
          templateUrl: basePath + 'baymodels/create/spec/spec.html',
          helpUrl: basePath + 'baymodels/create/spec/spec.help.html',
          formName: 'baymodelSpecForm'
        },
        {
          title: gettext('Network'),
          templateUrl: basePath + 'baymodels/create/network/network.html',
          helpUrl: basePath + 'baymodels/create/network/network.help.html',
          formName: 'baymodelNetworkForm'
        },
        {
          title: gettext('Labels'),
          templateUrl: basePath + 'baymodels/create/labels/labels.html',
          helpUrl: basePath + 'baymodels/create/labels/labels.help.html',
          formName: 'baymodelLabelsForm'
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
