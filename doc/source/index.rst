===============================
magnum-ui
===============================

Magnum Dashboard

* Free software: Apache license
* Source: http://git.openstack.org/cgit/openstack/magnum-ui
* Bugs: http://bugs.launchpad.net/magnum-ui

Installation instructions
=========================

Begin by cloning the Horizon and Magnum UI repositories::

    git clone https://github.com/openstack/horizon
    git clone https://github.com/openstack/magnum-ui

Create a virtual environment and install Horizon dependencies::

    cd horizon
    python tools/install_venv.py

Set up your ``local_settings.py`` file::

    cp openstack_dashboard/local/local_settings.py.example openstack_dashboard/local/local_settings.py

Open up the copied ``local_settings.py`` file in your preferred text
editor. You will want to customize several settings:

-  ``OPENSTACK_HOST`` should be configured with the hostname of your
   OpenStack server. Verify that the ``OPENSTACK_KEYSTONE_URL`` and
   ``OPENSTACK_KEYSTONE_DEFAULT_ROLE`` settings are correct for your
   environment. (They should be correct unless you modified your
   OpenStack server to change them.)


Install Magnum UI with all dependencies in your virtual environment::

    tools/with_venv.sh pip install -e ../magnum-ui/

And enable it in Horizon::

    cp ../magnum-ui/enabled/_50_add_containers_dashboard.py openstack_dashboard/local/enabled

Release Notes
=============

.. toctree::
  :glob:
  :maxdepth: 1

  releases/*

Source Code Reference
=====================

.. toctree::
  :glob:
  :maxdepth: 1

  sourcecode/autoindex


