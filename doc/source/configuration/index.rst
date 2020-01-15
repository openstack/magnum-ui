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

Horizon Settings
================

For more configurations, see
`Configuration Guide
<https://docs.openstack.org/horizon/latest/configuration/index.html>`__
in the Horizon documentation.

