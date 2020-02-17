=============
Configuration
=============

Magnum UI specific settings
===========================

CLUSTER_TEMPLATE_GROUP_FILTERS
------------------------------

.. versionadded:: 5.3.0 (Ussuri)

Default: ``None``

Examples:

.. code-block:: python

   CLUSTER_TEMPLATE_GROUP_FILTERS = {
       "dev": ".*-dev-.*",
       "prod": ".*-prod-.*"
   }

The settings expects a dictionary of group name, to group regex.

When set allows a cloud provider to specify template groups
for their cluster templates based on their naming convention.
This helps limit users from upgrading their cluster to an invalid
template that will not work based on their current template type.

This filtering is only relevant when choosing a new template for
upgrading a cluster.


MAGNUM_INGRESS_CONTROLLERS
--------------------------

.. versionadded:: 5.3.0 (Ussuri)

Default: ``None``

Examples:

.. code-block:: python

    MAGNUM_INGRESS_CONTROLLERS = [
        {
            "name": "NGINX",
            "labels": {
                "ingress_controller": "nginx"
            }
        },
        {
            "name": "Traefik",
            "labels": {
                "ingress_controller": "traefik"
            }
        },
        {
            "name": "Octavia",
            "labels": {
                "ingress_controller": "octavia"
            }
        }
    ]

This setting specifies which `Kubernetes Ingress Controllers <https://docs.openstack.org/horizon/latest/configuration/index.html>`__
are supported by the deployed version of magnum and map directly to the
response returned by the magnum-ui `api/container-infra/ingress_controllers` endpoint.

MAGNUM_AVAILABLE_ADDONS
-----------------------

.. versionadded:: 5.3.0 (Ussuri)

Default: ``None``

Examples:

.. code-block:: python

    MAGNUM_AVAILABLE_ADDONS = [
        {
            "name": "Kubernetes Dashboard",
            "selected": True,
            "labels": {
                "kube_dashboard_enabled": True
            },
            "labels_unselected": {
                "kube_dashboard_enabled": False
            }
        },
        {
            "name": "Influx Grafana Dashboard",
            "selected": False,
            "labels": {
                "influx_grafana_dashboard_enabled": True
            },
            "labels_unselected": {
                "influx_grafana_dashboard_enabled": False
            }
        }
    ]

Specifies which 'Addon Software' is available or supported in the deployed version
of magnum and specifies which labels need to be included in order to enable or
disable the Software Addon.

Examples of `Addon Software` include but are not limited to:

* `Kubernetes Dashboard <https://docs.openstack.org/magnum/latest/user/index.html#kube-dashboard-enabled>`__
* `Influx Grafana Dashboard <https://docs.openstack.org/magnum/train/user/index.html#influx-grafana-dashboard-enabled>`__

Values specified in the ``MAGNUM_AVAILABLE_ADDONS`` setting map directly to the
values returned in the response of the `api/container-infra/available_addons`
endpoint.

Horizon Settings
================

For more configurations, see
`Configuration Guide
<https://docs.openstack.org/horizon/latest/configuration/index.html>`__
in the Horizon documentation.
