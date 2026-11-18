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

"""Cluster lifecycle tests for Project > Container Infra > Clusters.

These create a real cluster, so they need a Magnum driver with a working
Cluster API management cluster and only run when MAGNUM_CLUSTER_TESTS is
set (see the magnum-ui-integration-tests-playwright-clusters job).
"""

import os
import re
import uuid

from django import test
from magnumclient import exceptions as magnum_exceptions

from magnum_ui.test.integration_tests import playwright_base
from magnum_ui.test.integration_tests import playwright_config as config


PANEL = 'clusters'


@test.tag('integration')
class ClustersTests(playwright_base.PlaywrightTestCase):

    def setUp(self):
        if not config.cluster_tests_enabled():
            self.skipTest('MAGNUM_CLUSTER_TESTS is not enabled')
        super().setUp()
        self.name = 'playwright-%s' % uuid.uuid4().hex[:8]

    def _create_template_via_api(self):
        template = self.magnum_client.cluster_templates.create(
            name=self.name,
            coe='kubernetes',
            image_id=config.get_image(),
            external_network_id=config.get_external_network(),
            flavor_id=config.get_flavor(),
            master_flavor_id=config.get_flavor(),
            network_driver=config.get_network_driver(),
            dns_nameserver='8.8.8.8',
            labels={'octavia_provider': 'ovn',
                    'master_lb_floating_ip_enabled': 'true'})
        self.addCleanup(self.magnum_client.cluster_templates.delete,
                        template.uuid)
        return template

    def _get_cluster(self):
        try:
            return self.magnum_client.clusters.get(self.name)
        except magnum_exceptions.NotFound:
            return None

    def _wait_for_status(self, status):
        def check():
            cluster = self._get_cluster()
            if cluster.status.endswith('_FAILED'):
                self.fail('Cluster %s: %s' % (cluster.status,
                                              cluster.status_reason))
            return cluster if cluster.status == status else None
        return self.wait_for(check, config.get_cluster_timeout(),
                             'cluster %s' % status)

    def _wait_for_deleted(self):
        def check():
            cluster = self._get_cluster()
            if cluster and cluster.status == 'DELETE_FAILED':
                self.fail('Cluster DELETE_FAILED: %s' % cluster.status_reason)
            return cluster is None
        self.wait_for(check, config.get_cluster_timeout(), 'cluster deletion')

    def _delete_cluster_via_api(self):
        if self._get_cluster():
            self.magnum_client.clusters.delete(self.name)
            self._wait_for_deleted()

    def _goto_clusters(self):
        # Waiting for the cluster can take longer than the dashboard session
        self.goto_panel('project', PANEL)
        if '/auth/login' in self.page.url:
            self.login()
            self.goto_panel('project', PANEL)

    def _row(self):
        return self.page.locator('tbody tr', has_text=self.name).first

    def _download(self, click, name):
        with self.page.expect_download() as download_info:
            click()
        download = download_info.value
        download_dir = os.path.join(config.get_output_dir(), 'downloads')
        os.makedirs(download_dir, exist_ok=True)
        path = os.path.join(download_dir, name)
        download.save_as(path)
        self.add_artifact_detail('download', path)
        with open(path) as f:
            return f.read()

    def _create_cluster(self, template):
        modal = self.open_modal(self.page.get_by_role(
            'button', name='Create Cluster'))
        modal.locator("input[name='name']").fill(self.name)
        modal.locator("select[name='cluster_template_id']").select_option(
            label=template.name)
        modal.locator("select[name='availability_zone']").select_option(
            label='nova')
        # Selecting the template resets the keypair
        modal.locator("select[name='keypair']").select_option(
            label=self.name)

        self.goto_wizard_step(modal, 'Size')
        master_count = modal.locator("input[name='master_count']")
        if master_count.is_editable():
            master_count.fill('1')
        modal.locator("select[name='master_flavor_id']").select_option(
            label=config.get_flavor())
        modal.locator("input[name='node_count']").fill('1')
        modal.locator("select[name='flavor_id']").select_option(
            label=config.get_flavor())
        self.take_screenshot('cluster_create_filled')

        self.addCleanup(self._delete_cluster_via_api)
        self.submit_modal(modal)
        self.wait_for_success_message()
        self.expect(self._row()).to_be_visible()
        self.take_screenshot('cluster_created')

    def test_cluster_lifecycle(self):
        template = self._create_template_via_api()
        self.create_keypair(self.name)

        # Create
        self.goto_panel('project', PANEL)
        self._create_cluster(template)
        cluster = self._wait_for_status('CREATE_COMPLETE')
        self._goto_clusters()
        self.expect(self._row()).to_contain_text('CREATE_COMPLETE')
        self.take_screenshot('cluster_create_complete')

        # Details
        self._row().get_by_role('link', name=self.name).click()
        self.expect(self.page).to_have_url(re.compile(cluster.uuid))
        self.expect(
            self.page.locator('.page-header .h1')).to_have_text(self.name)
        self.expect(
            self.page.get_by_text(cluster.api_address).first).to_be_visible()
        self.take_screenshot('cluster_details')

        # Get Cluster Config
        self._goto_clusters()
        row = self._row()
        row.locator('.split-caret').click()
        kubeconfig = self._download(
            row.get_by_text('Get Cluster Config', exact=True).click,
            '%s.kubeconfig' % self.name)
        self.assertIn('kind: Config', kubeconfig)
        self.assertIn(cluster.api_address, kubeconfig)

        # Show Certificate is the primary row action
        ca = self._download(
            self._row().get_by_role('button', name='Show Certificate').click,
            '%s_ca.pem' % self.name)
        self.assertIn('-----BEGIN CERTIFICATE-----', ca)

        # Delete
        row = self._row()
        row.locator('.split-caret').click()
        modal = self.open_modal(row.get_by_text('Delete Cluster', exact=True))
        modal.get_by_role('button', name='Delete Cluster').click()
        self.expect(modal).to_be_hidden()
        self.wait_for_success_message()
        self.take_screenshot('cluster_delete_requested')
        self._wait_for_deleted()
        self._goto_clusters()
        self.expect(self._row()).to_have_count(0)
        self.take_screenshot('cluster_deleted')
