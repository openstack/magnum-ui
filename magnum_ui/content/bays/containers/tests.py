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

# from django.core.urlresolvers import reverse
# import horizon
# from magnum_ui.containers.containers.panel import Containers
from openstack_dashboard.test import helpers as test


class ContainerTests(test.TestCase):
    def test_me(self):
        self.assertTrue(1 + 1 == 2)

# FIXME(shu-mutou): this tests seems not to work in new Horizon's plugin
# registration system
#     def test_registration(self):
#         dashboard = horizon.get_dashboard('project')
#         registered_panel = dashboard.get_panel('containers.containers')
#         self.assertEqual(registered_panel.slug, Containers.slug)

#     def test_index(self):
#         index = reverse('horizon:bays:containers:index')
#         res = self.client.get(index)
#         self.assertTemplateUsed(
#             res, 'project/bays/containers/index.html')
