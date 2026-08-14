# Copyright 2026
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.

from unittest import mock

from magnum_ui.api import magnum
from openstack_dashboard.test import helpers as test


class MagnumApiTestCase(test.TestCase):

    @mock.patch.object(magnum.client_utils, 'config_cluster')
    @mock.patch.object(magnum.client_utils, 'generate_csr_and_key')
    @mock.patch.object(magnum, 'magnumclient')
    def test_cluster_config_embeds_tls(self, mock_client, mock_generate,
                                       mock_config):
        cluster = mock.Mock(
            uuid='cluster-id', name='test',
            cluster_template_id='template-id', api_address='https://api')
        template = mock.Mock(tls_disabled=False)
        client = mock_client.return_value
        client.clusters.get.return_value = cluster
        client.cluster_templates.get.return_value = template
        client.certificates.get.return_value.pem = 'ca-pem'
        client.certificates.create.return_value.pem = 'cert-pem'
        mock_generate.return_value = {'csr': 'csr-pem', 'key': 'key-pem'}
        mock_config.return_value = 'complete-kubeconfig'

        result = magnum.cluster_config(self.request, 'cluster-id')

        self.assertEqual('complete-kubeconfig', result['cluster_config'])
        self.assertEqual('key-pem', result['key'])
        self.assertEqual('ca-pem', result['ca'])
        self.assertEqual('cert-pem', result['cert'])
        mock_config.assert_called_once_with(
            cluster, template, cfg_dir='',
            certs={'key': 'key-pem', 'ca': 'ca-pem', 'cert': 'cert-pem'},
            direct_output=True)

    @mock.patch.object(magnum, '_cluster_config')
    def test_cluster_config_download(self, mock_config):
        cluster = mock.Mock()
        cluster.name = 'test'
        mock_config.return_value = (
            cluster, {'cluster_config': 'complete-kubeconfig'})

        result = magnum.cluster_config_download(self.request, 'cluster-id')

        self.assertEqual(('test', 'complete-kubeconfig'), result)
