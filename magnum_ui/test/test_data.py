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
    TEST.baymodels = utils.TestDataContainer()
    TEST.bays = utils.TestDataContainer()

    # Bay Models
    baymodel_dict_1 = {"uuid": 1,
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
                       "public": ""}

    TEST.baymodels.add(baymodel_dict_1)

    # Bays
    bay_dict_1 = {"uuid": 1,
                  "name": "peopleknowme",
                  "baymodel": baymodel_dict_1["uuid"],
                  "node-count": "",
                  "master-count": "",
                  "discovery-url": "",
                  "timeout": 0}

    TEST.bays.add(bay_dict_1)
