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

from openstack_dashboard.api import neutron
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
        """
        result = magnum.cluster_template_list(request)
        return {'items': [change_to_id(n.to_dict()) for n in result]}

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
        return magnum.quotas_show(request, project_id, resource).to_dict()

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
