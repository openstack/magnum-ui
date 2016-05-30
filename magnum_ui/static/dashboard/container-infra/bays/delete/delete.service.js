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
    .module('horizon.dashboard.container-infra.bays')
    .factory('horizon.dashboard.container-infra.bays.delete.service', deleteService);

  deleteService.$inject = [
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.policy',
    'horizon.framework.widgets.modal.deleteModalService',
    'horizon.framework.util.i18n.gettext',
    'horizon.framework.util.q.extensions',
    'horizon.dashboard.container-infra.bays.events'
  ];

  /**
   * @ngDoc factory
   * @name horizon.dashboard.container-infra.bays.delete.service
   *
   * @Description
   * Brings up the delete bays confirmation modal dialog.
   * On submit, delete selected resources.
   * On cancel, do nothing.
   */
  function deleteService(
    magnum, policy, deleteModalService, gettext, $qExtensions, events
  ) {
    var scope;
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
        context.labels = labelize(selected.length);
        $qExtensions.allSettled(selected.map(checkPermission)).then(afterCheck);
      }else{
        // row (single)
        context.labels = labelize(1);
        deleteModalService.open(scope, [selected], context);
      }
    }

    function labelize(count){
      return {
          title: ngettext('Confirm Delete Bay',
                          'Confirm Delete Bays', count),
          /* eslint-disable max-len */
          message: ngettext('You have selected "%s". Please confirm your selection. Deleted bay is not recoverable.',
                            'You have selected "%s". Please confirm your selection. Deleted bays are not recoverable.', count),
          /* eslint-enable max-len */
          submit: ngettext('Delete Bay',
                           'Delete Bays', count),
          success: ngettext('Deleted Bay: %s.',
                            'Deleted Bays: %s.', count),
          error: ngettext('Unable to delete Bay: %s.',
                          'Unable to delete Bays: %s.', count)
        };
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
    function getEntity(result) {
      return result.context;
    }

    // call delete REST API
    function deleteEntity(id){
      return magnum.deleteBay(id, true);
    }
  }
})();
