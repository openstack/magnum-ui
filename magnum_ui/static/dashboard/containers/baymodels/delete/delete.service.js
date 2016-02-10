/**
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use self file except in compliance with the License. You may obtain
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
    .module('horizon.dashboard.containers.baymodels')
    .factory('horizon.dashboard.containers.baymodels.delete.deleteService', deleteService);

  deleteService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.dashboard.containers.baymodels.events'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.containers.baymodels.delete.deleteService
   *
   * @Description
   * Brings up the delete baymodels confirmation modal dialog.
   * On submit, delete selected resources.
   * On cancel, do nothing.
   */
  function deleteService(
    magnum, policy, deleteModalService, gettext, $qExtensions, events
  ) {
    var scope;
    var singleLabels = {
      title: gettext('Confirm Delete BayModel'),
      /* eslint-disable max-len */
      message: gettext('You have selected "%s". Please confirm your selection. Deleted baymodel is not recoverable.'),
      /* eslint-enable max-len */
      submit: gettext('Delete BayModel'),
      success: gettext('Deleted BayModel: %s.'),
      error: gettext('Unable to delete BayModel: %s.')
    };
    var multiLabels = {
      title: gettext('Confirm Delete BayModels'),
      /* eslint-disable max-len */
      message: gettext('You have selected "%s". Please confirm your selection. Deleted baymodels are not recoverable.'),
      /* eslint-enable max-len */
      submit: gettext('Delete BayModels'),
      success: gettext('Deleted BayModels: %s.'),
      error: gettext('Unable to delete BayModels: %s.')
    };
    var context = {
      labels: null,
      deleteEntity: deleteEntity,
      successEvent: events.DELETE_SUCCESS
    };

    var service = {
      initScope: initScope,
      allowed: allowed,
      perform: perform
    };

    return service;

    //////////////

    // include this function in your service
    // if you plan to emit events to the parent controller
    function initScope($scope) {
      scope = $scope;
    }

    function allowed() {
      return $qExtensions.booleanAsPromise(true);
    }

    // delete selected resource objects
    function perform(selected) {
      if(!selected.hasOwnProperty('id')){
        // batch (multi)
        context.labels = multiLabels;
        var items = getSelectedItems(selected);
        $qExtensions.allSettled(items.map(checkPermission)).then(afterCheck);
      }else{
        // row (single)
        context.labels = singleLabels;
        deleteModalService.open(scope, [selected], context);
      }
    }

    // for batch delete
    function checkPermission(selected) {
      return {promise: allowed(selected), context: selected};
    }

    // for batch delete
    function afterCheck(result){
      if (result.fail.length > 0) {
        toast.add('error', getMessage(notAllowedMessage, result.fail));
      }
      if (result.pass.length > 0) {
        deleteModalService.open(scope, result.pass.map(getEntity), context);
      }
    }

    // for batch delete
    function getSelectedItems(selected) {
      return Object.keys(selected).filter(isChecked).map(getItem);

      function isChecked(value) {
        return selected[value].checked;
      }

      function getItem(value) {
        return selected[value].item;
      }
    }

    // for batch delete
    function getEntity(result) {
      return result.context;
    }

    // call delete REST API
    function deleteEntity(id){
      return magnum.deleteBayModel(id, true);
    }
  }
})();
