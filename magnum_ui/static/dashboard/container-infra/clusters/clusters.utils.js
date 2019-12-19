/**
 * Copyright 2017 NEC Corporation
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

  /**
   * @ngdoc overview
   * @name horizon.dashboard.container-infra.clusters.utils
   * @description Service utilities for Clusters module.
   */
  angular
    .module('horizon.dashboard.container-infra.clusters')
    .factory('horizon.dashboard.container-infra.clusters.utils',
    clustersUtilsService);

  clustersUtilsService.$inject = [
    '$parse',
    'horizon.framework.util.q.extensions',
    '$timeout'
  ];

  function clustersUtilsService($parse, $qExtensions, $timeout) {

    var service = {
      getActionsDirectiveLinkFn: getActionsDirectiveLinkFn
    };

    return service;

    //////////////

    /**
     * Extends <actions> directive by conditionally enabling/disabling selected actions in the
     * cluster item's dropdown menu. This allows to block actions that are unavailable in certain
     * cluster states.
     * @param {Object} directive Extended directive
     * @returns {function} Directive's Link function
     */
    function getActionsDirectiveLinkFn(directive) {
      // List of Cluster statuses that will enable the 'conditional action'
      var ALLOWED_STATUSES_LIST = [
        'DELETE_COMPLETE',
        'CREATE_COMPLETE',
        'UPDATE_COMPLETE',
        'ROLLBACK_COMPLETE',
        'SNAPSHOT_COMPLETE',
        'CHECK_COMPLETE',
        'ADOPT_COMPLETE'
      ];

      // List of actions disabled/enabled based on the allowed statuses
      var CONDITIONAL_ACTIONS_LIST = [
        'resizeClusterAction',
        'rollingUpgradeClusterAction'
      ];

      // Important: If the <actions> directive template structure changes,
      // this selector might need to be updated.
      var ELEMENT_ACTIONS_SELECTOR = '.split-button,.dropdown-menu>li';
      var DISABLED_CLASS_NAME = 'disabled';

      var actionsDirectiveLinkFn = function(scope, element, attrs) {
        // Call the original `link` method to keep the default behaviour
        directive.link.apply(this, arguments);
        var listType = attrs.type;

        // Only do this for actions in the table's row
        if (listType !== 'row') { return; }

        var item = $parse(attrs.item)(scope);
        var allowedActions;

        var actionsParam = $parse(attrs.allowed)(scope);
        if (angular.isFunction(actionsParam)) {
          allowedActions = actionsParam();
        } else {
          allowedActions = actionsParam;
        }

        allowedActions.forEach(function(allowedAction) {
          allowedAction.promise = allowedAction.service.allowed(item);
        });

        $qExtensions.allSettled(allowedActions).then(disableConditionalRowActions);

        function disableConditionalRowActions(permittedActions) {
          if (permittedActions.pass.length < 1) { return; }

          // Gets evaluated AFTER DOM finishes rendering
          $timeout(applyActionAvailability, 0);

          function applyActionAvailability() {
            var actionElementsList = element[0].querySelectorAll(ELEMENT_ACTIONS_SELECTOR);
            permittedActions.pass.forEach(function(action, actionIndex) {
              if (isConditionalAction(action.context.id)) {
                var actionElement = angular.element(actionElementsList[actionIndex]);
                // If the status is not allowed - add disabling class
                if (isAllowedStatus(item.status)) {
                  actionElement.removeClass(DISABLED_CLASS_NAME);
                } else {
                  actionElement.addClass(DISABLED_CLASS_NAME);
                }
              }
            });
          }
        }
      };

      function isAllowedStatus(statusId) {
        return ALLOWED_STATUSES_LIST.indexOf(statusId) > -1;
      }

      function isConditionalAction(actionId) {
        return CONDITIONAL_ACTIONS_LIST.indexOf(actionId) > -1;
      }

      return actionsDirectiveLinkFn;
    }
  }
})();
