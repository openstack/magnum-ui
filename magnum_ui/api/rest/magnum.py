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
import re

from collections import defaultdict

from django.conf import settings
from django.http import HttpResponse
from django.http import HttpResponseNotFound
from django.views import generic

from magnum_ui.api import heat
from magnum_ui.api import magnum

from openstack_dashboard import api
from openstack_dashboard.api import neutron
from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils

LOG = logging.getLogger(__name__)


def change_to_id(obj):
    """Change key named 'uuid' to 'id'

    Magnum returns objects with a field called 'uuid' many of Horizons
    directives however expect objects to have a field called 'id'.
    """
    obj['id'] = obj.pop('uuid')
    return obj


@urls.register
class IngressControllers(generic.View):
    url_regex = r'container_infra/ingress_controllers/'

    @rest_utils.ajax()
    def get(self, request):
        configured_controllers = getattr(
            settings, "MAGNUM_INGRESS_CONTROLLERS", [])
        available_controllers = []

        for controller in configured_controllers:
            try:
                parsed = {}
                parsed["name"] = controller["name"]
                parsed["labels"] = controller["labels"]
                assert type(parsed["labels"]) is dict
                available_controllers.append(parsed)
            except KeyError as e:
                LOG.exception(e)
            except AssertionError as e:
                LOG.exception(e)

        return {"controllers": available_controllers}


@urls.register
class Addons(generic.View):
    url_regex = r'container_infra/available_addons/'

    @rest_utils.ajax()
    def get(self, request):
        available_addons = []

        configured_addons = getattr(
            settings, "MAGNUM_AVAILABLE_ADDONS", [])

        for configured_addon in configured_addons:
            addon = {}
            try:
                addon["name"] = configured_addon["name"]
                addon["selected"] = configured_addon["selected"]
                assert type(addon["selected"]) is bool
                addon["labels"] = configured_addon["labels"]
                assert type(addon["labels"]) is dict
                available_addons.append(addon)
            except KeyError as e:
                LOG.exception(e)
            except AssertionError as e:
                LOG.exception(e)

        return {"addons": available_addons}


@urls.register
class ClusterTemplate(generic.View):
    """API for retrieving a single cluster template"""
    url_regex = r'container_infra/cluster_templates/(?P<template_id>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, template_id):
        """Get a specific cluster template"""
        return change_to_id(magnum.cluster_template_show(request, template_id)
                            .to_dict())

    @rest_utils.ajax(data_required=True)
    def patch(self, request, template_id):
        """Update a Cluster Template.

        Returns the Cluster Template object on success.
        """
        params = request.DATA
        updated_template = magnum.cluster_template_update(
            request, template_id, **params)
        return rest_utils.CreatedResponse(
            '/api/container_infra/cluster_template/%s' % template_id,
            updated_template.to_dict())


@urls.register
class ClusterTemplates(generic.View):
    """API for Magnum Cluster Templates"""
    url_regex = r'container_infra/cluster_templates/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Cluster Templates for a project.

        The returned result is an object with property 'items' and each
        item under this is a Cluster Template.

        If a GET query param for 'related_to' is specified, and
        the setting for template filtering is set, then Horizon will
        only return template groups which the given template
        falls into, or all if none match.
        """
        templates = magnum.cluster_template_list(request)

        template_filters = getattr(
            settings, "CLUSTER_TEMPLATE_GROUP_FILTERS", None)
        related_to_id = request.GET.get("related_to")

        if template_filters and related_to_id:
            templates_by_id = {t.uuid: t for t in templates}
            related_to = templates_by_id.get(related_to_id)

            if related_to:
                matched_groups = []
                groups = defaultdict(list)
                for group, regex in template_filters.items():
                    pattern = re.compile(regex)
                    if pattern.match(related_to.name):
                        matched_groups.append(group)
                    for template in templates:
                        if pattern.match(template.name):
                            groups[group].append(template)

                if matched_groups:
                    new_templates = []
                    for group in matched_groups:
                        new_templates += groups[group]
                    templates = set(new_templates)

        return {'items': [change_to_id(n.to_dict()) for n in templates]}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more Cluster Templates by id.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for template_id in request.DATA:
            magnum.cluster_template_delete(request, template_id)

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new Cluster Template.

        Returns the new ClusterTemplate object on success.
        """
        new_template = magnum.cluster_template_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            '/api/container_infra/cluster_template/%s' % new_template.uuid,
            new_template.to_dict())


@urls.register
class Cluster(generic.View):
    """API for retrieving a single cluster"""
    url_regex = r'container_infra/clusters/(?P<cluster_id>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, cluster_id):
        """Get a specific cluster"""
        return change_to_id(magnum.cluster_show(request, cluster_id).to_dict())

    @rest_utils.ajax(data_required=True)
    def patch(self, request, cluster_id):
        """Update a Cluster.

        Returns the Cluster object on success.
        """
        params = request.DATA
        updated_cluster = magnum.cluster_update(
            request, cluster_id, **params)
        return rest_utils.CreatedResponse(
            '/api/container_infra/cluster/%s' % cluster_id,
            updated_cluster.to_dict())


@urls.register
class ClusterConfig(generic.View):
    """API for retrieving config for a single cluster"""
    url_regex = r'container_infra/clusters/(?P<cluster_id>[^/]+)/config$'

    @rest_utils.ajax()
    def get(self, request, cluster_id):
        """Get config for a specific cluster"""
        return magnum.cluster_config(request, cluster_id)


@urls.register
class ClusterResize(generic.View):

    url_regex = r'container_infra/clusters/(?P<cluster_id>[^/]+)/resize$'

    @rest_utils.ajax()
    def get(self, request, cluster_id):
        """Get cluster details for resize"""
        try:
            cluster = magnum.cluster_show(request, cluster_id).to_dict()
        except AttributeError as e:
            print(e)
            return HttpResponseNotFound()

        stack = heat.stack_get(request, cluster["stack_id"])
        search_opts = {"name": "%s-" % stack.stack_name}
        servers = api.nova.server_list(request, search_opts=search_opts)[0]

        worker_nodes = []
        for server in servers:
            if (server.name.startswith("%s-minion" % stack.stack_name) or
                    server.name.startswith("%s-node" % stack.stack_name)):
                worker_nodes.append({"name": server.name, "id": server.id})

        return {"cluster": change_to_id(cluster),
                "worker_nodes": worker_nodes}

    @rest_utils.ajax(data_required=True)
    def post(self, request, cluster_id):
        """Resize a cluster"""
        nodes_to_remove = request.DATA.get("nodes_to_remove", None)
        nodegroup = request.DATA.get("nodegroup", None)
        node_count = request.DATA.get("node_count")

        # Result will be 'None' unless error is raised response will be '204'
        try:
            return magnum.cluster_resize(
                request, cluster_id, node_count,
                nodes_to_remove=nodes_to_remove,
                nodegroup=nodegroup).to_dict()
        except AttributeError as e:
            # If cluster is not found magnum-client throws Attribute error
            # catch and respond with 404
            print(e)
            return HttpResponseNotFound()


@urls.register
class ClusterUpgrade(generic.View):

    url_regex = r'container_infra/clusters/(?P<cluster_id>[^/]+)/upgrade$'

    @rest_utils.ajax(data_required=True)
    def post(self, request, cluster_id):
        """Upgrade a cluster"""
        cluster_template = request.DATA.get("cluster_template")
        max_batch_size = request.DATA.get("max_batch_size", 1)
        nodegroup = request.DATA.get("nodegroup", None)

        return magnum.cluster_upgrade(
            request, cluster_id, cluster_template,
            max_batch_size=max_batch_size, nodegroup=nodegroup).to_dict()


@urls.register
class Clusters(generic.View):
    """API for Magnum Clusters"""
    url_regex = r'container_infra/clusters/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Clusters for a project.

        The returned result is an object with property 'items' and each
        item under this is a Cluster.
        """
        result = magnum.cluster_list(request)
        return {'items': [change_to_id(n.to_dict()) for n in result]}

    @rest_utils.ajax(data_required=True)
    def delete(self, request):
        """Delete one or more Clusters by id.

        Returns HTTP 204 (no content) on successful deletion.
        """
        for cluster_id in request.DATA:
            magnum.cluster_delete(request, cluster_id)

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new Cluster.

        Returns the new Cluster object on success.
        """
        new_cluster = magnum.cluster_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            '/api/container_infra/cluster/%s' % new_cluster.uuid,
            new_cluster.to_dict())


@urls.register
class Certificate(generic.View):
    """API for retrieving a single certificate"""
    url_regex = r'container_infra/certificates/(?P<cluster_id>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, cluster_id):
        """Get a certificate from a cluster.

        Returns the CA.pem string on success
        """
        ca = magnum.certificate_show(request, cluster_id)
        return ca.to_dict()

    @rest_utils.ajax(data_required=True)
    def delete(self, request, cluster_id):
        """Rotate a certificate from a clsuter.

        Returns HTTP 204 (no content) on successful deletion.
        """
        magnum.certificate_rotate(request, cluster_id)


@urls.register
class Certificates(generic.View):
    """API for Magnum Certificates"""
    url_regex = r'container_infra/certificates/$'

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new Certificate.

        Returns the new Cert.pem string from csr for a cluster on success.
        """
        new_cert = magnum.certificate_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            '/api/container_infra/certificates/',
            new_cert.to_dict())


@urls.register
class Stats(generic.View):
    """API for Magnum Stats"""
    url_regex = r'container_infra/stats/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Stats.

        The returned result is an object with property 'items' and each
        item under this is a Stat.
        """
        result = magnum.stats_list(request)
        return {'stats': {'clusters': result.clusters, 'nodes': result.nodes}}


@urls.register
class Quota(generic.View):
    """API for retrieving a single Quota"""
    url_regex =\
        r'container_infra/quotas/(?P<project_id>[^/]+)/(?P<resource>[^/]+)$'

    @rest_utils.ajax()
    def get(self, request, project_id, resource):
        """Get a specific quota"""
        try:
            return magnum.quotas_show(request, project_id, resource).to_dict()
        except AttributeError as e:
            LOG.exception(e)
            message = ("Quota could not be found: "
                       "project_id %s resource %s" % (project_id, resource))
            return HttpResponse(message, status=404)

    @rest_utils.ajax(data_required=True)
    def patch(self, request, project_id, resource):
        """Update a Quota.

        Returns the Quota object on success.
        """
        params = request.DATA
        updated = magnum.quotas_update(
            request, **params)
        return rest_utils.CreatedResponse(
            ('/api/container_infra/quotas/%s/%s' % (project_id, resource)),
            updated.to_dict())

    @rest_utils.ajax(data_required=True)
    def delete(self, request, project_id, resource):
        """Delete one Quota by id and resource.

        Returns HTTP 204 (no content) on successful deletion.
        """
        magnum.quotas_delete(request, project_id, resource)


@urls.register
class Quotas(generic.View):
    """API for Magnum Quotas"""
    url_regex = r'container_infra/quotas/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Quotas for a project.

        The returned result is an object with property 'items' and each
        item under this is a Quota.
        """
        result = magnum.quotas_list(request)
        return {'items': [n.to_dict() for n in result]}

    @rest_utils.ajax(data_required=True)
    def post(self, request):
        """Create a new Quota.

        Returns the new Quota object on success.
        """
        created = magnum.quotas_create(request, **request.DATA)
        return rest_utils.CreatedResponse(
            ('/api/container_infra/quotas/%s/%s' % (
                created.project_id, created.resource)),
            created.to_dict())


@urls.register
class Networks(generic.View):
    """API for Neutron networks for Cluster Templates creation"""
    url_regex = r'container_infra/networks/$'

    @rest_utils.ajax()
    def get(self, request):
        """Get a list of the Networks for a project.

        Networks includes external and private. Also, each network
        has subnets.
        The returned result is an object with property 'items' and each
        item under this is a Network.
        """
        tenant_id = request.user.tenant_id
        result = neutron.network_list_for_tenant(request, tenant_id,
                                                 include_external=True)
        return {'items': [n.to_dict() for n in result]}
