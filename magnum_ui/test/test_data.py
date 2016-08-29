# Copyright 2015 Cisco Systems, Inc.
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

from openstack_dashboard.test.test_data import utils


def data(TEST):
    # Test Data Container in Horizon
    TEST.cluster_templates = utils.TestDataContainer()
    TEST.clusters = utils.TestDataContainer()

    # Cluster Templates
    cluster_template_dict_1 = {"uuid": 1,
                               "name": "kindofabigdeal",
                               "image-id": "",
                               "keypair-id": "",
                               "external-network-id": "",
                               "coe": "",
                               "fixed-network": "",
                               "dns-nameserver": "",
                               "flavor-id": "",
                               "master-flavor-id": "",
                               "docker-volume-size": "",
                               "http-proxy": "",
                               "https-proxy": "",
                               "no-proxy": "",
                               "labels": "",
                               "tls-disabled": "",
                               "public": "",
                               "docker_storage_driver": "",
                               "fixed_subnet": "",
                               "floating_ip_enabled": "",
                               "master_lb_enabled": "",
                               "insecure_registry": ""}

    TEST.cluster_templates.add(cluster_template_dict_1)

    # Clusters
    cluster_dict_1 = {"uuid": 1,
                      "name": "peopleknowme",
                      "baymodel": cluster_template_dict_1["uuid"],
                      "node-count": "",
                      "master-count": "",
                      "discovery-url": "",
                      "timeout": 0}

    TEST.clusters.add(cluster_dict_1)
