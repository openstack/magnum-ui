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

"""Smoke tests for the Container Infra panels using Playwright."""

from django import test

from magnum_ui.test.integration_tests import playwright_base


@test.tag('integration')
class PanelsTests(playwright_base.PlaywrightTestCase):

    def _assert_panel_matches_api(self, panel, title, api_items):
        self.goto_panel('project', panel)
        self.take_screenshot('%s_loaded' % panel)

        self.expect(
            self.page.get_by_role('heading', name=title, exact=True)
        ).to_be_visible()

        table = self.page.locator('table').first
        if not api_items:
            self.expect(
                table.get_by_text('No items to display.')
            ).to_be_visible()
            return
        for item in api_items:
            self.expect(
                table.get_by_text(item.name, exact=True).first
            ).to_be_visible()

    def test_cluster_templates_match_magnum_api(self):
        self._assert_panel_matches_api(
            'cluster_templates', 'Cluster Templates',
            self.magnum_client.cluster_templates.list())

    def test_clusters_match_magnum_api(self):
        self._assert_panel_matches_api(
            'clusters', 'Clusters',
            self.magnum_client.clusters.list())
