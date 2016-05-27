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

import json
import mock

from magnum_ui.api.rest import magnum
from magnum_ui.test import test_data
from openstack_dashboard.test import helpers as test
from openstack_dashboard.test.test_data.utils import TestData

TEST = TestData(test_data.data)


class MagnumRestTestCase(test.TestCase):

    # Baymodels
    @mock.patch.object(magnum, 'magnum')
    def test_baymodel_get(self, client):
        request = self.mock_rest_request()
        client.baymodel_list.return_value = \
            mock_resource(TEST.baymodels.list())
        response = magnum.Baymodels().get(request)

        self.assertStatusCode(response, 200)
        self.assertItemsCollectionEqual(response, TEST.baymodels.list())
        client.baymodel_list.assert_called_once_with(request)

    @mock.patch.object(magnum, 'magnum')
    def test_baymodel_create(self, client):
        test_baymodels = mock_resource(TEST.baymodels.list())
        test_bmodel = test_baymodels[0]
        test_body = json.dumps(test_bmodel.to_dict())
        request = self.mock_rest_request(body=test_body)
        client.baymodel_create.return_value = test_bmodel
        response = magnum.Baymodels().post(request)

        self.assertStatusCode(response, 201)
        self.assertEqual(response['location'],
                         '/api/container-infra/baymodel/%s' % test_bmodel.uuid)
        client.baymodel_create.assert_called_once_with(request,
                                                       **test_bmodel.to_dict())

    @mock.patch.object(magnum, 'magnum')
    def test_baymodel_delete(self, client):
        test_baymodel = TEST.baymodels.first()
        request = self.mock_rest_request(
            body='{"baymodel_id":' + str(test_baymodel['uuid']) + '}')
        response = magnum.Baymodels().delete(request)

        self.assertStatusCode(response, 204)
        client.baymodel_delete.assert_called_once_with(
            request,
            u'baymodel_id')

    # Bays
    @mock.patch.object(magnum, 'magnum')
    def test_bay_get(self, client):
        request = self.mock_rest_request()
        client.bay_list.return_value = \
            mock_resource(TEST.bays.list())
        response = magnum.Bays().get(request)

        self.assertStatusCode(response, 200)
        self.assertItemsCollectionEqual(response, TEST.bays.list())
        client.bay_list.assert_called_once_with(request)

    @mock.patch.object(magnum, 'magnum')
    def test_bay_create(self, client):
        test_bays = mock_resource(TEST.bays.list())
        test_bay = test_bays[0]
        test_body = json.dumps(test_bay.to_dict())
        request = self.mock_rest_request(body=test_body)
        client.bay_create.return_value = test_bay
        response = magnum.Bays().post(request)

        self.assertStatusCode(response, 201)
        self.assertEqual(response['location'],
                         '/api/container-infra/bay/%s' % test_bay.uuid)
        client.bay_create.assert_called_once_with(request,
                                                  **test_bay.to_dict())

    @mock.patch.object(magnum, 'magnum')
    def test_bay_delete(self, client):
        test_bay = TEST.bays.first()
        request = self.mock_rest_request(
            body='{"bay_id":' + str(test_bay['uuid']) + '}')
        response = magnum.Bays().delete(request)

        self.assertStatusCode(response, 204)
        client.bay_delete.assert_called_once_with(
            request,
            u'bay_id')


def mock_resource(resource):
    """Utility function to make mocking more DRY"""

    mocked_data = \
        [mock.Mock(**{'to_dict.return_value': item}) for item in resource]

    return mocked_data
