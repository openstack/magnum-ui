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
from horizon.utils.memoized import memoized
from openstack_dashboard.api import base

LOG = logging.getLogger(__name__)

BAYMODEL_CREATE_ATTRS = ['name', 'image_id', 'flavor_id', 'master_flavor_id',
                         'keypair_id', 'external_network_id', 'fixed_network',
                         'dns_nameserver', 'docker_volume_size', 'labels',
                         'coe', 'http_proxy',
                         'https_proxy', 'no_proxy', 'network_driver',
                         'volume_driver',
                         'public', 'registry_enabled', 'tls_disabled']

BAY_CREATE_ATTRS = ['name', 'baymodel_id', 'node_count', 'discovery_url',
                    'bay_create_timeout', 'master_count']


@memoized
def magnumclient(request):
    magnum_url = ""
    try:
        magnum_url = base.url_for(request, 'container-infra')
    except exceptions.ServiceCatalogException:
        LOG.debug('No Container Infrastructure Management service is '
                  'configured.')
        return None

    LOG.debug('magnumclient connection created using the token "%s" and url'
              '"%s"' % (request.user.token.id, magnum_url))
    c = magnum_client.Client(username=request.user.username,
                             project_id=request.user.tenant_id,
                             input_auth_token=request.user.token.id,
                             magnum_url=magnum_url)
    return c


def baymodel_create(request, **kwargs):
    args = {}
    for (key, value) in kwargs.items():
        if key in BAYMODEL_CREATE_ATTRS:
            args[str(key)] = str(value)
        else:
            raise exceptions.InvalidAttribute(
                "Key must be in %s" % ",".join(BAYMODEL_CREATE_ATTRS))
        if key == "labels":
            labels = {}
            vals = value.split(",")
            for v in vals:
                kv = v.split("=", 1)
                labels[kv[0]] = kv[1]
            args["labels"] = labels
    return magnumclient(request).baymodels.create(**args)


def baymodel_delete(request, id):
    return magnumclient(request).baymodels.delete(id)


def baymodel_list(request, limit=None, marker=None, sort_key=None,
                  sort_dir=None, detail=True):
    return magnumclient(request).baymodels.list(limit, marker, sort_key,
                                                sort_dir, detail)


def baymodel_show(request, id):
    return magnumclient(request).baymodels.get(id)


def bay_create(request, **kwargs):
    args = {}
    for (key, value) in kwargs.items():
        if key in BAY_CREATE_ATTRS:
            args[key] = value
        else:
            raise exceptions.InvalidAttribute(
                "Key must be in %s" % ",".join(BAY_CREATE_ATTRS))
    return magnumclient(request).bays.create(**args)


def bay_update(request, id, patch):
    return magnumclient(request).bays.update(id, patch)


def bay_delete(request, id):
    return magnumclient(request).bays.delete(id)


def bay_list(request, limit=None, marker=None, sort_key=None,
             sort_dir=None, detail=True):
    return magnumclient(request).bays.list(limit, marker, sort_key,
                                           sort_dir, detail)


def bay_show(request, id):
    return magnumclient(request).bays.get(id)
