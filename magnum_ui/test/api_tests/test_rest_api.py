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

from unittest import mock

from oslo_serialization import jsonutils

from magnum_ui.api.rest import magnum
from magnum_ui.test import test_data
from openstack_dashboard.test import helpers as test
from openstack_dashboard.test.test_data import utils

TEST = utils.TestData(test_data.data)


class MagnumRestTestCase(test.RestAPITestCase):

    # Cluster Templates
    @mock.patch.object(magnum, 'magnum')
    def test_cluster_template_get(self, client):
        request = self.mock_rest_request()
        client.cluster_template_list.return_value = \
            mock_resource(TEST.cluster_templates.list())
        response = magnum.ClusterTemplates().get(request)

        self.assertStatusCode(response, 200)
        self.assertItemsCollectionEqual(response,
                                        TEST.cluster_templates.list())
        client.cluster_template_list.assert_called_once_with(request)

    @mock.patch.object(magnum, 'magnum')
    def test_cluster_template_create(self, client):
        test_cluster_templates = mock_resource(TEST.cluster_templates.list())
        test_cluster_template = test_cluster_templates[0]
        test_body = jsonutils.dumps(test_cluster_template.to_dict())
        request = self.mock_rest_request(body=test_body)
        client.cluster_template_create.return_value = test_cluster_template
        response = magnum.ClusterTemplates().post(request)
        url = '/api/container_infra/cluster_template/%s' % \
              test_cluster_template.uuid

        self.assertStatusCode(response, 201)
        self.assertEqual(response['location'], url)
        client.cluster_template_create.assert_called_once_with(
            request, **test_cluster_template.to_dict())

    @mock.patch.object(magnum, 'magnum')
    def test_cluster_template_delete(self, client):
        test_cluster_template = TEST.cluster_templates.first()
        request = self.mock_rest_request(
            body='{"cluster_template_id":' +
                 str(test_cluster_template['uuid']) + '}')
        response = magnum.ClusterTemplates().delete(request)

        self.assertStatusCode(response, 204)
        client.cluster_template_delete.assert_called_once_with(
            request,
            'cluster_template_id')

    # Clusters
    @mock.patch.object(magnum, 'magnum')
    def test_cluster_get(self, client):
        request = self.mock_rest_request()
        client.cluster_list.return_value = \
            mock_resource(TEST.clusters.list())
        response = magnum.Clusters().get(request)

        self.assertStatusCode(response, 200)
        self.assertItemsCollectionEqual(response, TEST.clusters.list())
        client.cluster_list.assert_called_once_with(request)

    @mock.patch.object(magnum, 'magnum')
    def test_cluster_create(self, client):
        test_clusters = mock_resource(TEST.clusters.list())
        test_cluster = test_clusters[0]
        test_body = jsonutils.dumps(test_cluster.to_dict())
        request = self.mock_rest_request(body=test_body)
        client.cluster_create.return_value = test_cluster
        response = magnum.Clusters().post(request)
        url = '/api/container_infra/cluster/%s' % test_cluster.uuid

        self.assertStatusCode(response, 201)
        self.assertEqual(response['location'], url)
        client.cluster_create.assert_called_once_with(request,
                                                      **test_cluster.to_dict())

    @mock.patch.object(magnum, 'magnum')
    def test_cluster_delete(self, client):
        test_cluster = TEST.clusters.first()
        request = self.mock_rest_request(
            body='{"cluster_id":' + str(test_cluster['uuid']) + '}')
        response = magnum.Clusters().delete(request)

        self.assertStatusCode(response, 204)
        client.cluster_delete.assert_called_once_with(
            request,
            'cluster_id')

    # Certificates
    @mock.patch.object(magnum, 'magnum')
    def test_certificate_create(self, client):
        test_certificates = mock_resource(TEST.certificates.list())
        test_certificate = test_certificates[0]
        test_body = jsonutils.dumps(test_certificate.to_dict())
        request = self.mock_rest_request(body=test_body)

        test_res_list = mock_resource(TEST.certificate_res_list.list())
        test_res = test_res_list[0]
        client.certificate_create.return_value = test_res

        response = magnum.Certificates().post(request)
        res_body = jsonutils.loads(response.content.decode('utf-8'))

        self.assertStatusCode(response, 201)
        self.assertEqual(res_body['pem'], test_res.to_dict()['pem'])
        client.certificate_create.assert_called_once_with(
            request, **test_certificate.to_dict())


def mock_resource(resource):
    """Utility function to make mocking more DRY"""

    mocked_data = \
        [mock.Mock(**{'to_dict.return_value': item}) for item in resource]

    return mocked_data
