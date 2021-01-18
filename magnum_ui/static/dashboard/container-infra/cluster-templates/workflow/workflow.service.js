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
    .module('horizon.dashboard.container-infra.cluster-templates')
    .factory(
      'horizon.dashboard.container-infra.cluster-templates.workflow',
      ClusterTemplateWorkflow);

  ClusterTemplateWorkflow.$inject = [
    '$q',
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext',
    'horizon.app.core.openstack-service-api.magnum',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.core.openstack-service-api.glance',
    'horizon.dashboard.container-infra.cluster-templates.distros'
  ];

  function ClusterTemplateWorkflow(
    $q,
    basePath,
    workflowService,
    gettext,
    magnum,
    nova,
    glance,
    distros
  ) {
    var workflow = {
      init: init,
      update: update
    };

    var form, model, images, nflavors, mflavors, keypairs,
      externalNetworks, fixedNetworks, fixedSubnets;
    var fixedSubnetsInitial = gettext("Choose a Private Network at first");

    function init(action, title) {
      var schema;
      var coes = [{value: '', name: gettext("Choose a Container Orchestration Engine")},
                   {value: "swarm", name: gettext("Docker Swarm")},
                   {value: "swarm-mode", name: gettext("Docker Swarm Mode")},
                   {value: "kubernetes", name: gettext("Kubernetes")},
                   {value: "mesos", name: gettext("Mesos")},
                   {value: "dcos", name: gettext("DC/OS")}];
      /* default is first value */
      var supportedNetworkDrivers = {
        initial: [{value:"", name: gettext("Choose a Network Driver")},
                  {value: "docker", name: gettext("Docker")},
                  {value: "flannel", name: gettext("Flannel")},
                  {value: "calico", name: gettext("Calico")}],
        kubernetes: [{value:"flannel", name: gettext("Flannel")},
                     {value: "calico", name: gettext("Calico")}],
        swarm: [{value:"docker", name: gettext("Docker")},
                {value:"flannel", name: gettext("Flannel")}],
        "swarm-mode": [{value:"docker", name: gettext("Docker")},
                       {value:"flannel", name: gettext("Flannel")}],
        mesos: [{value:"docker", name: gettext("Docker")}],
        dcos: [{value:"docker", name: gettext("Docker")}]};
      var supportedVolumeDrivers = {
        initial: [{value:"", name: gettext("Choose a Volume Driver")},
                  {value: "cinder", name: gettext("Cinder")},
                  {value: "rexray", name: gettext("Rexray")}],
        kubernetes: [{value:"", name: gettext("Choose a Volume Driver")},
                     {value:"cinder", name: gettext("Cinder")}],
        swarm: [{value:"", name: gettext("Choose a Volume Driver")},
                {value:"rexray", name: gettext("Rexray")}],
        "swarm-mode": [{value:"", name: gettext("Choose a Volume Driver")},
                       {value:"rexray", name: gettext("Rexray")}],
        mesos: [{value:"", name: gettext("Choose a Volume Driver")},
                {value:"rexray", name: gettext("Rexray")}],
        dcos: [{value:"", name: gettext("Choose a Volume Driver")},
                {value:"rexray", name: gettext("Rexray")}]};

      // schema
      schema = {
        type: 'object',
        properties: {
          'name': {
            title: gettext('Cluster Template Name'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext('Name of the cluster template.')
            }
          },
          'coe': {
            title: gettext('Container Orchestration Engine'),
            type: 'string'
          },
          'public': {
            title: gettext('Public'),
            type: 'boolean'
          },
          'hidden': {
            title: gettext('Hidden'),
            type: 'boolean'
          },
          'registry_enabled': {
            title: gettext('Enable Registry'),
            type: 'boolean'
          },
          'tls_disabled': {
            title: gettext('Disable TLS'),
            type: 'boolean'
          },
          'image_id': {
            type: 'string',
            title: gettext('Image')
          },
          'keypair_id': {
            title: gettext('Keypair'),
            type: 'string'
          },
          'flavor_id': {
            title: gettext('Flavor'),
            type: 'string'
          },
          'master_flavor_id': {
            title: gettext('Master Flavor'),
            type: 'string'
          },
          'volume_driver': {
            title: gettext('Volume Driver'),
            type: 'string'
          },
          'docker_storage_driver': {
            title: gettext('Docker Storage Driver'),
            type: 'string'
          },
          'docker_volume_size': {
            title: gettext('Docker Volume Size (GB)'),
            type: 'number',
            'x-schema-form': {
              type: 'number',
              placeholder: gettext('Specify the size in GB for the docker volume')
            }
          },
          'insecure_registry': {
            title: gettext('Insecure Registry'),
            type: 'string'
          },
          'network_driver': {
            title: gettext('Network Driver'),
            type: 'string'
          },
          'http_proxy': {
            title: gettext('HTTP Proxy'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext('The http_proxy address to use for nodes in cluster')
            }
          },
          'https_proxy': {
            title: gettext('HTTPS Proxy'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext('The https_proxy address to use for nodes in cluster')
            }
          },
          'no_proxy': {
            title: gettext('No Proxy'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext('The no_proxy address to use for nodes in cluster')
            }
          },
          'external_network_id': {
            title: gettext('External Network ID'),
            type: 'string'
          },
          'fixed_network': {
            title: gettext('Fixed Network'),
            type: 'string'
          },
          'fixed_subnet': {
            title: gettext('Fixed Subnet'),
            type: 'string'
          },
          'dns_nameserver': {
            title: gettext('DNS'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext('The DNS nameserver to use for this cluster template')
            }
          },
          'master_lb_enabled': {
            title: gettext('Master LB'),
            type: 'boolean'
          },
          'floating_ip_enabled': {
            title: gettext('Floating IP'),
            type: 'boolean'
          },
          'labels': {
            title: gettext('Labels'),
            type: 'string',
            'x-schema-form': {
              type: 'textarea',
              placeholder: gettext('KEY1=VALUE1, KEY2=VALUE2...')
            }
          }
        }
      };

      // form
      form = [
        {
          type:'tabs',
          tabs: [
            {
              title: gettext('Info'),
              help: basePath + 'cluster-templates/workflow/info.help.html',
              type: 'section',
              htmlClass: 'row',
              items: [
                {
                  type: 'section',
                  htmlClass: 'col-xs-12',
                  items: [
                    {
                      key: 'name'
                    },
                    {
                      key: 'coe',
                      type: 'select',
                      titleMap: coes,
                      required: true,
                      onChange: function() {
                        if (model.coe) {
                          form[0].tabs[2].items[0].items[0].items[0].titleMap =
                            supportedNetworkDrivers[model.coe];
                          model.network_driver =
                            supportedNetworkDrivers[model.coe][0].value;
                          form[0].tabs[1].items[0].items[2].items[0].titleMap =
                            supportedVolumeDrivers[model.coe];
                          model.volume_driver =
                            supportedVolumeDrivers[model.coe][0].value;
                        } else {
                          form[0].tabs[2].items[0].items[0].items[0].titleMap =
                            supportedNetworkDrivers.initial;
                          model.network_driver =
                            supportedNetworkDrivers.initial[0].value;
                          form[0].tabs[1].items[0].items[2].items[0].titleMap =
                            supportedVolumeDrivers.initial;
                          model.volume_driver =
                            supportedVolumeDrivers.initial[0].value;
                        }
                      }
                    },
                    {
                      key: 'public'
                    },
                    {
                      key: 'hidden'
                    },
                    {
                      key: 'registry_enabled'
                    },
                    {
                      key: 'tls_disabled'
                    }
                  ]
                }
              ],
              required: true
            },
            {
              title: gettext('Node Spec'),
              help: basePath + 'cluster-templates/workflow/spec.help.html',
              type: 'section',
              htmlClass: 'row',
              items: [
                {
                  type: 'section',
                  htmlClass: 'row',
                  items: [
                    {
                      type: 'section',
                      htmlClass: 'col-xs-6',
                      items: [
                        {
                          key: 'image_id',
                          type: 'select',
                          titleMap: images,
                          required: true
                        },
                        {
                          key: 'flavor_id',
                          type: 'select',
                          titleMap: nflavors
                        }
                      ]
                    },
                    {
                      type: 'section',
                      htmlClass: 'col-xs-6',
                      items: [
                        {
                          key: 'keypair_id',
                          type: 'select',
                          titleMap: keypairs
                        },
                        {
                          key: 'master_flavor_id',
                          type: 'select',
                          titleMap: mflavors
                        }
                      ]
                    },
                    {
                      type: 'section',
                      htmlClass: 'col-xs-12',
                      items: [
                        {
                          key: 'volume_driver',
                          type: 'select',
                          titleMap: supportedVolumeDrivers.initial
                        }
                      ]
                    },
                    {
                      type: 'section',
                      htmlClass: 'col-xs-6',
                      items: [
                        {
                          key: 'docker_storage_driver',
                          type: 'select',
                          titleMap: [
                            {value: "devicemapper", name: gettext("Device Mapper")},
                            {value: "overlay", name: gettext("Overlay")},
                            {value: "overlay2", name: gettext("Overlay2")}
                          ]
                        }
                      ]
                    },
                    {
                      type: 'section',
                      htmlClass: 'col-xs-6',
                      items: [
                        {
                          key: 'docker_volume_size'
                        }
                      ]
                    },
                    {
                      type: 'section',
                      htmlClass: 'col-xs-12',
                      items: [
                        {
                          key: 'insecure_registry'
                        }
                      ]
                    }
                  ]
                }
              ],
              required: true
            },
            {
              title: gettext('Network'),
              help: basePath + 'cluster-templates/workflow/network.help.html',
              type: 'section',
              htmlClass: 'row',
              items: [
                {
                  type: 'section',
                  htmlClass: 'row',
                  items: [
                    {
                      type: 'section',
                      htmlClass: 'col-xs-12',
                      items: [
                        {
                          key: 'network_driver',
                          type: 'select',
                          titleMap: supportedNetworkDrivers.initial
                        },
                        {
                          key: 'http_proxy'
                        },
                        {
                          key: 'https_proxy'
                        },
                        {
                          key: 'no_proxy'
                        },
                        {
                          key: 'external_network_id',
                          type: 'select',
                          titleMap: externalNetworks,
                          required: true
                        },
                        {
                          key: 'fixed_network',
                          type: 'select',
                          titleMap: fixedNetworks,
                          onChange: function () {
                            changeFixedNetwork(model);
                          }
                        },
                        {
                          key: 'fixed_subnet',
                          type: 'select',
                          titleMap: fixedSubnets
                        },
                        {
                          key: 'dns_nameserver'
                        },
                        {
                          key: 'master_lb_enabled'
                        },
                        {
                          key: 'floating_ip_enabled'
                        }
                      ]
                    }
                  ]
                }
              ],
              required: true
            },
            {
              title: gettext('Labels'),
              help: basePath + 'cluster-templates/workflow/labels.help.html',
              type: 'section',
              htmlClass: 'row',
              items: [
                {
                  type: 'section',
                  htmlClass: 'row',
                  items: [
                    {
                      type: 'section',
                      htmlClass: 'col-xs-12',
                      items: [
                        {
                          key: 'labels'
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      model = {
        name: "",
        coe: "",
        server_type: "",
        public: "",
        hidden: "",
        registry_enabled: "",
        tls_disabled: "",
        image_id: "",
        flavor_id: "",
        master_flavor_id: "",
        docker_volume_size: "",
        docker_storage_driver: "",
        keypair_id: "",
        network_driver: "",
        volume_driver: "",
        insecure_registry: "",
        http_proxy: "",
        https_proxy: "",
        no_proxy: "",
        external_network_id: "",
        fixed_network: "",
        fixed_subnet: "",
        dns_nameserver: "",
        master_lb_enabled: "",
        floating_ip_enabled: true,
        labels: ""
      };

      var config = {
        title: title,
        schema: schema,
        form: form,
        model: model
      };

      update(config);
      return config;
    }

    // called by update.service
    function update(config) {
      $q.all({
        images: glance.getImages().then(onGetImages),
        flavors: nova.getFlavors(false, false).then(onGetFlavors),
        keypairs: nova.getKeypairs().then(onGetKeypairs),
        networks: magnum.getNetworks().then(onGetNetworks)
      }).then(function() {
        changeFixedNetwork(config.model, init);
      });
    }

    function onGetImages(response) {
      images = [{value:"", name: gettext("Choose an Image")}];
      angular.forEach(response.data.items, function(item) {
        if (!angular.isUndefined(item.properties) &&
          distros.indexOf(item.properties.os_distro) >= 0) {
          images.push({value: item.name, name: item.name});
        }
      });
      form[0].tabs[1].items[0].items[0].items[0].titleMap = images;
      var deferred = $q.defer();
      deferred.resolve(images);
      return deferred.promise;
    }

    function onGetFlavors(response) {
      nflavors = [{value:"", name: gettext("Choose a Flavor for the Node")}];
      mflavors = [{value:"", name: gettext("Choose a Flavor for the Master Node")}];
      angular.forEach(response.data.items, function(item) {
        nflavors.push({value: item.name, name: item.name});
        mflavors.push({value: item.name, name: item.name});
      });
      form[0].tabs[1].items[0].items[0].items[1].titleMap = nflavors;
      form[0].tabs[1].items[0].items[1].items[1].titleMap = mflavors;
      var deferred = $q.defer();
      deferred.resolve(nflavors);
      return deferred.promise;
    }

    function onGetKeypairs(response) {
      keypairs = [{value:"", name: gettext("Choose a Keypair")}];
      angular.forEach(response.data.items, function(item) {
        keypairs.push({value: item.keypair.name, name: item.keypair.name});
      });
      form[0].tabs[1].items[0].items[1].items[0].titleMap = keypairs;
      var deferred = $q.defer();
      deferred.resolve(keypairs);
      return deferred.promise;
    }

    function onGetNetworks(response) {
      externalNetworks = [{value:"", name: gettext("Choose a External Network")}];
      fixedNetworks = [{value:"", name: gettext("Choose a Private Network")}];
      angular.forEach(response.data.items, function(item) {
        if (item["router:external"]) {
          externalNetworks.push({value: item.id, name: item.name});
        } else {
          fixedNetworks.push({value: item.id, name: item.name, subnets: item.subnets});
        }
      });
      form[0].tabs[2].items[0].items[0].items[4].titleMap = externalNetworks;
      form[0].tabs[2].items[0].items[0].items[5].titleMap = fixedNetworks;
      var deferred = $q.defer();
      deferred.resolve({
        externalNetworks: externalNetworks,
        fixedNetworks: fixedNetworks
      });
      return deferred.promise;
    }

    function changeFixedNetwork(model) {
      if (model.fixed_network) {
        fixedSubnets = [{value:"", name: gettext("Choose a Private Subnet")}];
        angular.forEach(fixedNetworks, function(fixed) {
          if (fixed.value === model.fixed_network) {
            angular.forEach(fixed.subnets, function(subnet) {
              fixedSubnets.push({value: subnet.id, name: subnet.name});
            });
          }
        });
      } else {
        fixedSubnets = [{value:"", name: fixedSubnetsInitial}];
        model.fixed_subnet = "";
      }
      form[0].tabs[2].items[0].items[0].items[6].titleMap = fixedSubnets;
    }

    return workflow;
  }
})();
