/**
 * Copyright 2015, Cisco Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
(function () {
  'use strict';

  angular
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.magnum', MagnumAPI);

  MagnumAPI.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service',
    'horizon.framework.util.i18n.gettext'
  ];

  function MagnumAPI(apiService, toastService, gettext) {
    var service = {
      createBay: createBay,
      getBay: getBay,
      getBays: getBays,
      deleteBay: deleteBay,
      deleteBays: deleteBays,
      createBaymodel: createBaymodel,
      getBaymodel: getBaymodel,
      getBaymodels: getBaymodels,
      deleteBaymodel: deleteBaymodel,
      deleteBaymodels: deleteBaymodels,
    };

    return service;

    //////////
    // Bays //
    //////////

    function createBay(params) {
        return apiService.post('/api/containers/bays/', params)
          .error(function() {
            toastService.add('error', gettext('Unable to create Bay.'));
          });
      }

    function getBay(id) {
      return apiService.get('/api/containers/bays/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Bay.'));
        });
    }

    function getBays() {
      return apiService.get('/api/containers/bays/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Bays.'));
        });
    }

    function deleteBay(id, suppressError) {
      var promise = apiService.delete('/api/containers/bays/', [id]);
      return suppressError ? promise : promise.error(function() {
        var msg = gettext('Unable to delete the Bay with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteBays(ids) {
      return apiService.delete('/api/containers/bays/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Bays.'));
        });
    }

    ///////////////
    // Baymodels //
    ///////////////

    function createBaymodel(params) {
      return apiService.post('/api/containers/baymodels/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to create Baymodel'));
        });
    }

    function getBaymodel(id) {
      return apiService.get('/api/containers/baymodels/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Baymodel.'));
        });
    }

    function getBaymodels() {
      return apiService.get('/api/containers/baymodels/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Baymodels.'));
        });
    }

    function deleteBaymodel(id, suppressError) {
      var promise = apiService.delete('/api/containers/baymodels/', [id]);
      return suppressError ? promise : promise.error(function() {
        var msg = gettext('Unable to delete the Baymodel with id: %(id)s');
        toastService.add('error', interpolate(msg, { id: id }, true));
      });
    }

    // FIXME(shu-mutou): Unused for batch-delete in Horizon framework in Feb, 2016.
    function deleteBaymodels(ids) {
      return apiService.delete('/api/containers/baymodels/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Baymodels.'));
        })
    }
  }
}());
