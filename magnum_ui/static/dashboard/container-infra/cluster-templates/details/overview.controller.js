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
    .module('horizon.dashboard.container-infra.cluster-templates')
    .controller('ClusterTemplateOverviewController', ClusterTemplateOverviewController);

  ClusterTemplateOverviewController.$inject = [
    '$scope',
    'horizon.app.core.openstack-service-api.glance'
  ];

  function ClusterTemplateOverviewController(
    $scope,
    glance
  ) {
    var ctrl = this;
    ctrl.cluster_template = {};
    ctrl.image_uuid = "";
    ctrl.objLen = objLen;

    $scope.context.loadPromise.then(onGetClusterTemplate);

    function onGetClusterTemplate(template) {
      ctrl.cluster_template = template.data;
      glance.getImages().then(onGetImages);
    }

    function onGetImages(images) {
      angular.forEach(images.data.items, function(image) {
        if (image.name === ctrl.cluster_template.image_id) {
          ctrl.image_uuid = image.id;
        }
      });
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
