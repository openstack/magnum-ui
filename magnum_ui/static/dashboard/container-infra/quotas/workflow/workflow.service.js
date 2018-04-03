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

  angular
    .module('horizon.dashboard.container-infra.quotas')
    .factory(
      'horizon.dashboard.container-infra.quotas.workflow',
      QuotaWorkflow);

  QuotaWorkflow.$inject = [
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext',
    'horizon.app.core.openstack-service-api.keystone'
  ];

  function QuotaWorkflow(basePath, workflowService, gettext, keystone) {
    var workflow = {
      init: init
    };

    function init(action, title, $scope) {
      var schema, form, model;
      var projects = [{value:"", name: gettext("Choose a Project")}];
      var resources = [{value:"Cluster", name: gettext("Cluster")}];

      // schema
      schema = {
        type: 'object',
        properties: {
          'project_id': {
            title: gettext('Project'),
            type: 'string'
          },
          'resource': {
            title: gettext('Resource'),
            type: 'string'
          },
          'hard_limit': {
            title: gettext('Hard Limit'),
            type: 'number',
            minimum: 1
          }
        }
      };

      // form
      form = [
        {
          type: 'section',
          htmlClass: 'row',
          items: [
            {
              type: 'section',
              htmlClass: 'col-xs-12',
              items: [
                {
                  key: 'project_id',
                  type: 'select',
                  titleMap: projects,
                  required: true,
                  readonly: action === 'update'
                },
                {
                  key: 'resource',
                  type: 'select',
                  titleMap: resources,
                  required: true,
                  readonly: action === 'update'
                },
                {
                  key: 'hard_limit',
                  placeholder: gettext('Limit for this resource.'),
                  required: true
                }
              ]
            }
          ]
        }
      ];

      keystone.getProjects().then(onGetProjects);

      function onGetProjects(response) {
        angular.forEach(response.data.items, function(item) {
          projects.push({value: item.id, name: item.name});
        });
        form[0].items[0].items[0].titleMap = projects;
      }

      model = {
        id: "",
        project_id: "",
        resource: "Cluster",
        hard_limit: null
      };

      var config = {
        title: title,
        schema: schema,
        form: form,
        model: model
      };

      $scope.model = model;

      return config;
    }

    return workflow;
  }

})();
