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


from __future__ import absolute_import

import logging

from magnumclient.v1 import client as magnum_client

from horizon import exceptions

from openstack_dashboard.api import base

LOG = logging.getLogger(__name__)


def magnumclient(request):
    magnum_url = ""
    try:
        magnum_url = base.url_for(request, 'container')
    except exceptions.ServiceCatalogException:
        LOG.debug('No Containers service is configured.')
        return None

    LOG.debug('magnumclient connection created using the token "%s" and url'
              '"%s"' % (request.user.token.id, magnum_url))
    c = magnum_client.Client(username=request.user.username,
                             project_id=request.user.tenant_id,
                             input_auth_token=request.user.token.id,
                             magnum_url=magnum_url)
    return c
