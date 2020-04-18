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

from unittest import mock

from magnum_ui import api
from magnum_ui.test import test_data
from magnumclient.v1 import client as magnum_client
from openstack_dashboard.test import helpers


class APITestCase(helpers.APITestCase):
    """Extends the base Horizon APITestCase for magnumclient"""

    def setUp(self):
        super(APITestCase, self).setUp()
        self._original_magnumclient = api.magnum.magnumclient
        api.magnum.magnumclient = lambda request: self.stub_magnumclient()

    def _setup_test_data(self):
        super(APITestCase, self)._setup_test_data()
        test_data.data(self)

    def tearDown(self):
        super(APITestCase, self).tearDown()
        api.magnum.magnumclient = self._original_magnumclient

    def stub_magnumclient(self):
        if not hasattr(self, "magnumclient"):
            magnum_client.Client = mock.Mock()
            self.magnumclient = magnum_client.Client
        return self.magnumclient
