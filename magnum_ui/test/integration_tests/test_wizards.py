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

"""Integration tests for the create wizards.

These only exercise the forms client-side: Magnum has no in-tree drivers,
so cluster templates (and therefore clusters) cannot be created in CI
without installing one.
"""

from django import test

from magnum_ui.test.integration_tests import playwright_base


@test.tag('integration')
class WizardTests(playwright_base.PlaywrightTestCase):

    def _assert_wizard(self, modal, title, steps):
        self.expect(modal.locator('.modal-title')).to_have_text(title)
        for step in steps:
            self.expect(
                modal.locator('.wizard-nav li', has_text=step)
            ).to_be_visible()
        submit = modal.locator('.modal-footer .btn-primary')
        self.expect(submit).to_be_disabled()
        return submit

    def _cancel(self, modal):
        modal.get_by_role('button', name='Cancel').click()
        self.expect(modal).to_be_hidden()

    def test_create_cluster_template_wizard(self):
        self.goto_panel('project', 'cluster_templates')
        modal = self.open_modal(self.page.get_by_role(
            'button', name='Create Cluster Template'))
        submit = self._assert_wizard(
            modal, 'Create Cluster Template',
            ['Info', 'Node Spec', 'Network', 'Labels'])

        # Image and external network are still required on later steps
        modal.locator("input[name='name']").fill('playwright-template')
        modal.locator("select[name='coe']").select_option(label='Kubernetes')
        self.take_screenshot('cluster_template_info_filled')
        self.expect(submit).to_be_disabled()

        self._cancel(modal)

    def test_create_cluster_wizard(self):
        self.goto_panel('project', 'clusters')
        modal = self.open_modal(self.page.get_by_role(
            'button', name='Create Cluster'))
        self._assert_wizard(modal, 'Create New Cluster', ['Details', 'Size'])
        self.expect(
            modal.locator("select[name='cluster_template_id']")
        ).to_be_visible()
        self.take_screenshot('cluster_wizard_opened')

        self._cancel(modal)
