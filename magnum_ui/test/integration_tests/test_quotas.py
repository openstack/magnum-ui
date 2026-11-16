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

"""Integration tests for the Admin > Container Infra > Quotas panel."""

from django import test
from magnumclient import exceptions as magnum_exceptions

from magnum_ui.test.integration_tests import playwright_base
from magnum_ui.test.integration_tests import playwright_config as config


# Horizon maps the 'container_infra.quotas' panel slug to this URL
QUOTAS_PANEL = 'container_infra/quotas'
RESOURCE = 'Cluster'


@test.tag('integration')
class QuotasTests(playwright_base.PlaywrightTestCase):

    def _delete_quota_via_api(self):
        try:
            self.magnum_client.quotas.delete(self.project_id, RESOURCE)
        except magnum_exceptions.NotFound:
            pass

    def _create_quota_via_api(self, hard_limit):
        self.magnum_client.quotas.create(project_id=self.project_id,
                                         resource=RESOURCE,
                                         hard_limit=hard_limit)
        self.addCleanup(self._delete_quota_via_api)

    def _quota_row(self):
        return self.page.locator('tbody tr', has_text=self.project_id).first

    def test_create_quota(self):
        self.goto_panel('admin', QUOTAS_PANEL)
        self.expect(
            self.page.get_by_role('heading', name='Quotas', exact=True)
        ).to_be_visible()

        modal = self.open_modal(
            self.page.get_by_role('button', name='Create Quota'))
        modal.locator("select[name='project_id']").select_option(
            label=config.get_project_name())
        modal.locator("select[name='resource']").select_option(label=RESOURCE)
        modal.locator("input[name='hard_limit']").fill('5')
        self.take_screenshot('create_quota_filled')
        self.addCleanup(self._delete_quota_via_api)
        self.submit_modal(modal)

        self.wait_for_success_message()
        self.expect(self._quota_row()).to_be_visible()
        self.take_screenshot('quota_created')
        quota = self.magnum_client.quotas.get(self.project_id, RESOURCE)
        self.assertEqual(5, quota.hard_limit)

    def test_update_quota(self):
        self._create_quota_via_api(hard_limit=5)
        self.goto_panel('admin', QUOTAS_PANEL)

        modal = self.open_modal(
            self._quota_row().get_by_role('button', name='Update Quota'))
        modal.locator("input[name='hard_limit']").fill('10')
        self.take_screenshot('update_quota_filled')
        self.submit_modal(modal)

        self.wait_for_success_message()
        self.take_screenshot('quota_updated')
        quota = self.magnum_client.quotas.get(self.project_id, RESOURCE)
        self.assertEqual(10, quota.hard_limit)

    def test_delete_quota(self):
        self._create_quota_via_api(hard_limit=5)
        self.goto_panel('admin', QUOTAS_PANEL)

        row = self._quota_row()
        row.locator('.split-caret').click()
        modal = self.open_modal(row.get_by_text('Delete Quota', exact=True))
        self.take_screenshot('delete_quota_confirm')
        modal.get_by_role('button', name='Delete Quota').click()
        self.expect(modal).to_be_hidden()

        self.wait_for_success_message()
        self.expect(self._quota_row()).to_have_count(0)
        self.take_screenshot('quota_deleted')
        # Magnum returns the default limit for projects without an explicit
        # quota, so check the explicit quota is gone from the list instead
        quotas = self.magnum_client.quotas.list(all_tenants=True)
        self.assertNotIn((self.project_id, RESOURCE),
                         [(q.project_id, q.resource) for q in quotas])


@test.tag('integration')
class QuotasPolicyTests(playwright_base.PlaywrightTestCase):

    auto_login = False
    # Horizon reports the denied access to the admin panel as an error
    allow_errors = True

    def test_quotas_panel_hidden_for_member(self):
        self.login(config.get_demo_username(), config.get_demo_password())
        self.goto_panel('admin', QUOTAS_PANEL)
        self.take_screenshot('member_quotas_url')
        # Make sure the URL exists, so the test can't pass on a 404
        self.expect(self.page.get_by_text('Page not found')).to_have_count(0)
        self.expect(
            self.page.get_by_role('heading', name='Quotas', exact=True)
        ).to_have_count(0)
