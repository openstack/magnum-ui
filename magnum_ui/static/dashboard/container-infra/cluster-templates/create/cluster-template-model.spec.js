/**
 *    (c) Copyright 2016 NEC Corporation
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

  describe('horizon.dashboard.container-infra.cluster-templates.model', function() {
    var template, specModel;

    specModel = {
      name: null,
      coe: "",
      public: null,
      registry_enabled: null,
      tls_disabled: null,
      image_id: "",
      flavor_id: "",
      master_flavor_id: "",
      docker_volume_size: null,
      docker_storage_driver: "devicemapper",
      keypair_id: "",
      network_driver: "",
      volume_driver: "",
      http_proxy: null,
      https_proxy: null,
      no_proxy: null,
      external_network_id: "",
      fixed_network: "",
      fixed_subnet: "",
      dns_nameserver: null,
      master_lb_enabled: "",
      floating_ip_enabled: true,
      labels: null,
      network_drivers : [{name: "", label: gettext("Choose a Network Driver")},
                         {name: "docker", label: gettext("Docker")},
                         {name: "flannel", label: gettext("Flannel")}],
      volume_drivers : [{name: "", label: gettext("Choose a Volume Driver")},
                        {name: "cinder", label: gettext("Cinder")},
                        {name: "rexray", label: gettext("Rexray")}],
      docker_storage_drivers: [{name: "devicemapper", label: gettext("Device Mapper")},
                               {name: "overlay", label: gettext("Overley")}]
    };

    beforeEach(module('horizon.dashboard.container-infra.cluster-templates'));
    beforeEach(inject(function($injector) {
      template = $injector.get('horizon.dashboard.container-infra.cluster-templates.model');
    }));

    it('newClusterTemplateSpec', testTemplatemodel);

    function testTemplatemodel() {
      template.init();
      expect(specModel).toEqual(template.newClusterTemplateSpec);
    }

    it('createClusterTemplate', inject(function($q, $injector) {
      var magnum = $injector.get('horizon.app.core.openstack-service-api.magnum');
      var deferred = $q.defer();
      spyOn(magnum, 'createClusterTemplate').and.returnValue(deferred.promise);

      template.init();
      template.createClusterTemplate();

      expect(magnum.createClusterTemplate).toHaveBeenCalled();

    }));

  });

})();
