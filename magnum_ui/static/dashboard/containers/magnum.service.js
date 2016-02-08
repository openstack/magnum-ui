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
    'horizon.framework.widgets.toast.service'
  ];

  function MagnumAPI(apiService, toastService) {
    var service = {
      createBay: createBay,
      getBay: getBay,
      getBays: getBays,
      deleteBay: deleteBay,
      deleteBays: deleteBays,
      createBayModel: createBayModel,
      getBayModel: getBayModel,
      getBayModels: getBayModels,
      deleteBayModel: deleteBayModel,
      deleteBayModels: deleteBayModels,
      createContainer: createContainer,
      getContainer: getContainer,
      getContainers: getContainers,
      deleteContainer: deleteContainer,
      deleteContainers: deleteContainers,
      memoryUnits: memoryUnits,
      convertMemorySize: convertMemorySize,
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

    function deleteBay(id) {
      return apiService.delete('/api/containers/bays/', [id])
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Bay.'));
        });
    }

    function deleteBays(ids) {
      return apiService.delete('/api/containers/bays/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Bays.'));
        });
    }

    ///////////////
    // BayModels //
    ///////////////

    function createBayModel(params) {
      return apiService.post('/api/containers/baymodels/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to create BayModel'));
        });
    }

    function getBayModel(id) {
      return apiService.get('/api/containers/baymodels/' + id)
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the BayModel.'));
        });
    }

    function getBayModels() {
      return apiService.get('/api/containers/baymodels/')
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the BayModels.'))
        });
    }

    function deleteBayModel(id) {
      return apiService.delete('/api/containers/baymodels/', [id])
        .error(function() {
          toastService.add('error', gettext('Unable to delete the BayModel.'))
        })
    }

    function deleteBayModels(ids) {
      return apiService.delete('/api/containers/baymodels/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the BayModels.'))
        })
    }


    ////////////////
    // Containers //
    ////////////////

    function createContainer(params) {
      return apiService.post('/api/containers/containers/', params)
        .error(function() {
          toastService.add('error', gettext('Unable to create Container.'));
        });
    }

    function getContainer(id) {
      return apiService.get('/api/containers/containers/' + id)
        .success(function(data, status, headers, config) {
          convertMemorySize(data);
          return data;
        })
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Container.'));
        });
    }

    function getContainers() {
      return apiService.get('/api/containers/containers/')
        .success(function(data, status, headers, config) {
          angular.forEach(data.items, function(container, idx){
            convertMemorySize(container);
          });
          return data;
        })
        .error(function() {
          toastService.add('error', gettext('Unable to retrieve the Containers.'));
        });
    }

    function deleteContainer(id) {
      return apiService.delete('/api/containers/containers/', [id])
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Container.'));
        });
    }

    function deleteContainers(ids) {
      return apiService.delete('/api/containers/containers/', ids)
        .error(function() {
          toastService.add('error', gettext('Unable to delete the Containers.'));
        });
    }
  }

  var memoryUnits = { "b": gettext("bytes"),
      "k": gettext("KB"),
      "m": gettext("MB"),
      "g": gettext("GB")};

  function convertMemorySize(container){
    container.memorysize = "";
    container.memoryunit = "";
    if(container.memory !== null){
      // separate number and unit.
      var regex = /(\d+)([bkmg]?)/;
      var match = regex.exec(container.memory);
      container.memorysize = match[1];
      if(match[2]){
        container.memoryunit = memoryUnits[match[2]];
      }
    }
  };

}());
