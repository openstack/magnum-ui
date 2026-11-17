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

"""Integration tests for the Project > Container Infra > Cluster Templates.

Creating cluster templates requires a Magnum driver for the image's
os_distro, which the job installs (magnum-capi-helm).
"""

import re
import uuid

from django import test
from magnumclient import exceptions as magnum_exceptions

from magnum_ui.test.integration_tests import playwright_base
from magnum_ui.test.integration_tests import playwright_config as config


PANEL = 'cluster_templates'


@test.tag('integration')
class ClusterTemplatesTests(playwright_base.PlaywrightTestCase):

    def setUp(self):
        super().setUp()
        self.template_name = 'playwright-%s' % uuid.uuid4().hex[:8]

    def _delete_template_via_api(self, id_or_name):
        try:
            self.magnum_client.cluster_templates.delete(id_or_name)
        except magnum_exceptions.NotFound:
            pass

    def _create_template_via_api(self):
        template = self.magnum_client.cluster_templates.create(
            name=self.template_name,
            coe='kubernetes',
            image_id=config.get_image(),
            external_network_id=config.get_external_network(),
            # Magnum fails to update templates without flavors
            flavor_id=config.get_flavor(),
            master_flavor_id=config.get_flavor())
        self.addCleanup(self._delete_template_via_api, template.uuid)
        return template

    def _row(self, name):
        return self.page.locator('tbody tr', has_text=name).first

    def _open_row_menu_action(self, name, action):
        row = self._row(name)
        row.locator('.split-caret').click()
        return self.open_modal(row.get_by_text(action, exact=True))

    def test_create_cluster_template(self):
        self.goto_panel('project', PANEL)
        modal = self.open_modal(self.page.get_by_role(
            'button', name='Create Cluster Template'))

        modal.locator("input[name='name']").fill(self.template_name)
        modal.locator("select[name='coe']").select_option(label='Kubernetes')
        self.goto_wizard_step(modal, 'Node Spec')
        modal.locator("select[name='image_id']").select_option(
            label=config.get_image())
        self.goto_wizard_step(modal, 'Network')
        modal.locator("select[name='external_network_id']").select_option(
            label=config.get_external_network())
        self.take_screenshot('cluster_template_filled')

        self.addCleanup(self._delete_template_via_api, self.template_name)
        self.submit_modal(modal)

        self.wait_for_success_message()
        self.expect(self._row(self.template_name)).to_be_visible()
        self.take_screenshot('cluster_template_created')
        template = self.magnum_client.cluster_templates.get(
            self.template_name)
        self.assertEqual('kubernetes', template.coe)
        self.assertEqual(config.get_image(), template.image_id)

    def test_cluster_template_details(self):
        template = self._create_template_via_api()
        self.goto_panel('project', PANEL)

        self._row(self.template_name).get_by_role(
            'link', name=self.template_name).click()
        self.expect(self.page).to_have_url(re.compile(template.uuid))
        self.expect(
            self.page.locator('.page-header .h1')
        ).to_have_text(self.template_name)
        self.take_screenshot('cluster_template_details')

    def test_update_cluster_template(self):
        template = self._create_template_via_api()
        new_name = self.template_name + '-updated'
        self.goto_panel('project', PANEL)

        modal = self._open_row_menu_action(self.template_name,
                                           'Update Cluster Template')
        modal.locator("input[name='name']").fill(new_name)
        self.take_screenshot('cluster_template_update_filled')
        self.submit_modal(modal)

        self.wait_for_success_message()
        self.expect(self._row(new_name)).to_be_visible()
        self.take_screenshot('cluster_template_updated')
        self.assertEqual(
            new_name,
            self.magnum_client.cluster_templates.get(template.uuid).name)

    def test_delete_cluster_template(self):
        template = self._create_template_via_api()
        self.goto_panel('project', PANEL)

        modal = self._open_row_menu_action(self.template_name,
                                           'Delete Cluster Template')
        self.take_screenshot('cluster_template_delete_confirm')
        modal.get_by_role('button', name='Delete Cluster Template').click()
        self.expect(modal).to_be_hidden()

        self.wait_for_success_message()
        self.expect(self._row(self.template_name)).to_have_count(0)
        self.take_screenshot('cluster_template_deleted')
        self.assertRaises(magnum_exceptions.NotFound,
                          self.magnum_client.cluster_templates.get,
                          template.uuid)

    def test_create_cluster_from_template(self):
        template = self._create_template_via_api()
        self.goto_panel('project', PANEL)

        # "Create Cluster" is the primary row action of a cluster template
        modal = self.open_modal(self._row(self.template_name).get_by_role(
            'button', name='Create Cluster'))
        self.expect(modal.locator('.modal-title')).to_have_text(
            'Create New Cluster')
        self.expect(
            modal.locator("select[name='cluster_template_id'] option",
                          has_text=self.template_name)
        ).to_have_attribute('value', re.compile(template.uuid))
        self.take_screenshot('cluster_wizard_from_template')

        modal.get_by_role('button', name='Cancel').click()
        self.expect(modal).to_be_hidden()
