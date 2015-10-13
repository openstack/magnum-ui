#  Copyright 2015 Cisco Systems.
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

from django.views import generic

from magnum_ui.api import magnum

from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils


def change_to_id(obj):
    """Change key named 'uuid' to 'id'

    Magnum returns objects with a field called 'uuid' many of Horizons
    directives however expect objects to have a field called 'id'.
    """
    obj['id'] = obj.pop('uuid')
    return obj


@urls.register
class BayModels(generic.View):
    """API for Magnum BayModels
    """
    url_regex = r'containers/baymodels/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the BayModels for a project.

        The returned result is an object with property 'baymodels' and each
        item under this is a BayModel.
        """
        result = magnum.baymodel_list(request)
        return{'baymodels': [change_to_id(n.to_dict()) for n in result]}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more BayModels by id.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for baymodel_id in request.DATA:
            magnum.baymodel_delete(request, baymodel_id)

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new BayModel.

        Returns the new BayModel object on success.
        """
        new_baymodel = magnum.baymodel_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            '/api/containers/baymodel/%s' % new_baymodel.id,
            new_baymodel.to_dict())


@urls.register
class Bays(generic.View):
    """API for Magnum Bays
    """
    url_regex = r'containers/bays/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Bays for a project.

        The returned result is an object with property 'bays' and each
        item under this is a Bay.
        """
        result = magnum.bay_list(request)
        return{'bays': [n.to_dict() for n in result]}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more Bays by id.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for bay_id in request.DATA:
            magnum.bay_delete(request, bay_id)

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new Bay.

        Returns the new Bay object on success.
        """
        new_bay = magnum.bay_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            '/api/containers/bay/%s' % new_bay.uuid,
            new_bay.to_dict())
