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


import logging

from django.conf import settings

from horizon.utils.memoized import memoized
from openstack_dashboard.api import base

from heatclient import client as heat_client

LOG = logging.getLogger(__name__)


@memoized
def heatclient(request, password=None):

    service_type = 'orchestration'
    openstack_api_versions = getattr(settings, 'OPENSTACK_API_VERSIONS', {})
    api_version = openstack_api_versions.get(service_type, 1)

    insecure = getattr(settings, 'OPENSTACK_SSL_NO_VERIFY', False)
    cacert = getattr(settings, 'OPENSTACK_SSL_CACERT', None)

    endpoint = base.url_for(request, 'orchestration')
    kwargs = {
        'token': request.user.token.id,
        'insecure': insecure,
        'ca_file': cacert,
        'username': request.user.username,
        'password': password
    }

    client = heat_client.Client(api_version, endpoint, **kwargs)
    client.format_parameters = format_parameters
    return client


def format_parameters(params):
    parameters = {}
    for count, p in enumerate(params, 1):
        parameters['Parameters.member.%d.ParameterKey' % count] = p
        parameters['Parameters.member.%d.ParameterValue' % count] = params[p]
    return parameters


def stack_get(request, stack_id):
    return heatclient(request).stacks.get(stack_id)
