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
    'horizon.dashboard.container-infra.basePath',
    'horizon.app.core.workflow.factory',
    'horizon.framework.util.i18n.gettext',
    'horizon.app.core.openstack-service-api.nova',
    'horizon.app.core.openstack-service-api.glance'
  ];

  function ClusterTemplateWorkflow(basePath, workflowService, gettext, nova, glance) {
    var workflow = {
      init: init
    };

    function init(action, title) {
      var schema, form, model;
      var images = [{value:"", name: gettext("Choose an Image")}];
      var nflavors = [{value:"", name: gettext("Choose a Flavor for the Node")}];
      var mflavors = [{value:"", name: gettext("Choose a Flavor for the Master Node")}];
      var keypairs = [{value:"", name: gettext("Choose a Keypair")}];

      var coes = [{value: '', name: gettext("Choose a Container Orchestration Engine")},
                   {value: "swarm", name: gettext("Docker Swarm")},
                   {value: "kubernetes", name: gettext("Kubernetes")},
                   {value: "mesos", name: gettext("Mesos")}];
      /* default is first value */
      var supportedNetworkDrivers = {
        initial: [{value:"", name: gettext("Choose a Network Driver")},
                  {value: "docker", name: gettext("Docker")},
                  {value: "flannel", name: gettext("Flannel")}],
        kubernetes: [{value:"flannel", name: gettext("Flannel")}],
        swarm: [{value:"docker", name: gettext("Docker")},
                {value:"flannel", name: gettext("Flannel")}],
        mesos: [{value:"docker", name: gettext("Docker")}]};
      var supportedVolumeDrivers = {
        initial: [{value:"", name: gettext("Choose a Volume Driver")},
                  {value: "cinder", name: gettext("Cinder")},
                  {value: "rexray", name: gettext("Rexray")}],
        kubernetes: [{value:"", name: gettext("Choose a Volume Driver")},
                     {value:"cinder", name: gettext("Cinder")}],
        swarm: [{value:"", name: gettext("Choose a Volume Driver")},
                {value:"rexray", name: gettext("Rexray")}],
        mesos: [{value:"", name: gettext("Choose a Volume Driver")},
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
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext(
                'The external Neutron network ID to connect to this cluster template')
            }
          },
          'fixed_network': {
            title: gettext('Fixed Network'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext(
                'The private Neutron network name to connect to this cluster template')
            }
          },
          'fixed_subnet': {
            title: gettext('Fixed Subnet'),
            type: 'string',
            'x-schema-form': {
              type: 'string',
              placeholder: gettext(
                'The private Neutron subnet name to connect to this cluster template')
            }
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
                          titleMap: [
                            {value: '', name: gettext('Choose a Volume Driver')},
                            {value: 'cinder', name: gettext('Cinder')},
                            {value: 'rexray', name: gettext('Rexray')}
                          ]
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
                            {value: "overlay", name: gettext("Overlay")}
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
                          titleMap: [
                            {value: "", name: gettext("Choose a Network Driver")},
                            {value: "docker", name: gettext("Docker")},
                            {value: "flannel", name: gettext("Flannel")}
                          ]
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
                          required: true
                        },
                        {
                          key: 'fixed_network'
                        },
                        {
                          key: 'fixed_subnet'
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
                          key: 'labels',
                          // fixme: to be available, needs to fix bug/1638863
                          readonly: action === 'update'
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

      glance.getImages().then(onGetImages);
      nova.getFlavors(false, false).then(onGetFlavors);
      nova.getKeypairs().then(onGetKeypairs);

      function onGetImages(response) {
        angular.forEach(response.data.items, function(item) {
          images.push({value: item.name, name: item.name});
        });
      }

      function onGetFlavors(response) {
        angular.forEach(response.data.items, function(item) {
          nflavors.push({value: item.name, name: item.name});
          mflavors.push({value: item.name, name: item.name});
        });
      }

      function onGetKeypairs(response) {
        angular.forEach(response.data.items, function(item) {
          keypairs.push({value: item.keypair.name, name: item.keypair.name});
        });
      }

      model = {
        name: "",
        coe: "",
        public: "",
        registry_enabled: "",
        tls_disabled: "",
        image_id: "",
        flavor_id: "",
        master_flavor_id: "",
        docker_volume_size: "",
        docker_storage_driver: "devicemapper",
        keypair_id: "",
        network_driver: "",
        volume_driver: "",
        http_proxy: "",
        https_proxy: "",
        no_proxy: "",
        external_network_id: "",
        fixed_network: "",
        fixed_subnet: "",
        dns_nameserver: "",
        master_lb_enabled: "",
        floating_ip_enabled: "",
        labels: ""
      };

      var config = {
        title: title,
        schema: schema,
        form: form,
        model: model
      };

      return config;
    }

    return workflow;
  }

})();
