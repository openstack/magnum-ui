# plugin.sh - DevStack plugin.sh dispatch script magnum-ui

MAGNUM_UI_DIR=$(cd $(dirname $BASH_SOURCE)/.. && pwd)

function install_magnum_ui {
    # NOTE(shu-mutou): workaround for devstack bug: 1540328
    # where devstack install 'test-requirements' but should not do it
    # for magnum-ui project as it installs Horizon from url.
    # Remove following two 'mv' commands when mentioned bug is fixed.
    mv $MAGNUM_UI_DIR/test-requirements.txt $MAGNUM_UI_DIR/_test-requirements.txt

    setup_develop ${MAGNUM_UI_DIR}

    mv $MAGNUM_UI_DIR/_test-requirements.txt $MAGNUM_UI_DIR/test-requirements.txt
}

function configure_magnum_ui {
    cp -a ${MAGNUM_UI_DIR}/magnum_ui/enabled/* ${DEST}/horizon/openstack_dashboard/local/enabled/
    # NOTE: If locale directory does not exist, compilemessages will fail,
    # so check for an existence of locale directory is required.
    if [ -d ${MAGNUM_UI_DIR}/magnum_ui/locale ]; then
        (cd ${MAGNUM_UI_DIR}/magnum_ui; DJANGO_SETTINGS_MODULE=openstack_dashboard.settings $PYTHON ../manage.py compilemessages)
    fi
}

# check for service enabled
if is_service_enabled magnum-ui; then

    if [[ "$1" == "stack" && "$2" == "pre-install"  ]]; then
        # Set up system services
        # no-op
        :

    elif [[ "$1" == "stack" && "$2" == "install"  ]]; then
        # Perform installation of service source
        echo_summary "Installing Magnum UI"
        install_magnum_ui

    elif [[ "$1" == "stack" && "$2" == "post-config"  ]]; then
        # Configure after the other layer 1 and 2 services have been configured
        echo_summary "Configuring Magnum UI"
        configure_magnum_ui

    elif [[ "$1" == "stack" && "$2" == "extra"  ]]; then
        # no-op
        :
    fi

    if [[ "$1" == "unstack"  ]]; then
        # no-op
        :
    fi

    if [[ "$1" == "clean"  ]]; then
        # Remove state and transient data
        # Remember clean.sh first calls unstack.sh
        # no-op
        :
    fi
fi
