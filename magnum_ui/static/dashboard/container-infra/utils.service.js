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
  "use strict";

  angular.module('horizon.dashboard.container-infra')
    .factory('horizon.dashboard.container-infra.utils.service',
        utilsService);

  /*
   * @ngdoc factory
   * @name horizon.dashboard.container-infra.utils.service
   *
   * @description
   * A utility service providing helpers for the Magnum UI frontend.
   */
  function utilsService() {
    return {
      versionCompare: versionCompare
    };

    function versionCompare(v1, v2, options) {
      var lexicographical = options && options.lexicographical;
      var zeroExtend = options && options.zeroExtend;
      var v1parts = v1.split('.');
      var v2parts = v2.split('.');

      // Step 1: Validation
      function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
      }
      if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
      }

      // Step 2: Normalise
      function normaliseParts(parts) {
        if (zeroExtend) {
          while (parts.length < parts.length) { parts.push("0"); }
        }
        if (!lexicographical) {
          parts = parts.map(Number);
        }
        return parts;
      }
      v1parts = normaliseParts(v1parts);
      v2parts = normaliseParts(v2parts);

      // Step 3: Comparison
      for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length === i) { return 1; }

        if (v1parts[i] === v2parts[i]) {
          continue;
        }
        if (v1parts[i] > v2parts[i]) {
          return 1;
        }
        return -1;
      }
      if (v1parts.length !== v2parts.length) { return -1; }

      return 0;
    }
  }
})();
