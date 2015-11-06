# Copyright 2015 Cisco Systems, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

from magnum_ui import api
from magnum_ui.test import helpers as test


class MagnumApiTests(test.APITestCase):
    def test_container_list(self):
        containers = self.magnum_containers.list()
        form_data = {'marker': None,
                     'limit': None,
                     'sort_key': None,
                     'sort_dir': None,
                     'detail': False}

        magnumclient = self.stub_magnumclient()
        magnumclient.containers = self.mox.CreateMockAnything()
        magnumclient.containers.list(**form_data).AndReturn(containers)
        self.mox.ReplayAll()

        api.magnum.container_list(self.request)

    def test_container_get(self):
        container = self.magnum_containers.first()

        magnumclient = self.stub_magnumclient()
        magnumclient.containers = self.mox.CreateMockAnything()
        magnumclient.containers.get(container['uuid']).AndReturn(container)
        self.mox.ReplayAll()

        api.magnum.container_show(self.request, container['uuid'])

    def test_container_delete(self):
        container = self.magnum_containers.first()

        magnumclient = self.stub_magnumclient()
        magnumclient.containers = self.mox.CreateMockAnything()
        magnumclient.containers.delete(container['uuid'])
        self.mox.ReplayAll()

        api.magnum.container_delete(self.request, container['uuid'])

    def test_container_create(self):
        container = self.magnum_containers.first()
        form_data = {'bay_uuid': container['bay'],
                     'name': container['name']}

        magnumclient = self.stub_magnumclient()
        magnumclient.containers = self.mox.CreateMockAnything()
        magnumclient.containers.create(**form_data)\
            .AndReturn(container)
        self.mox.ReplayAll()

        api.magnum.container_create(self.request, **form_data)
