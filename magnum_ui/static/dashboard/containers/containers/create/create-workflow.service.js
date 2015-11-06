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
    .module('horizon.dashboard.containers.containers')
    .factory('horizon.dashboard.containers.containers.workflow', containerWorkflow);

  containerWorkflow.$inject = [
    'horizon.dashboard.containers.basePath',
    'horizon.app.core.workflow.factory'
  ];

  function containerWorkflow(basePath, dashboardWorkflow) {
    return dashboardWorkflow({
      title: gettext('Create Container'),

      steps: [
        {
          title: gettext('Info'),
          templateUrl: basePath + 'containers/create/info/info.html',
          helpUrl: basePath + 'containers/create/info/info.help.html',
          formName: 'containerInfoForm'
        },
        {
          title: gettext('Spec'),
          templateUrl: basePath + 'containers/create/spec/spec.html',
          helpUrl: basePath + 'containers/create/spec/spec.help.html',
          formName: 'containerSpecForm'
        }
      ],

      btnText: {
        finish: gettext('Create')
      },

      btnIcon: {
        finish: 'fa fa-cloud-download'
      }
    });
  }
})();
