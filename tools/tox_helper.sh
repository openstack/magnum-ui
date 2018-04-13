#!/usr/bin/env bash

ENVNAME=$1
BASEPYTHON=$2
COMMAND=$3

if [ ${COMMAND} = "pre" ]; then
    # crean-up
    rm -fr .tox/${ENVNAME}-log/
    # install horizon from git
    rm -fr .tox/${ENVNAME}/src/
    git clone https://git.openstack.org/openstack/horizon.git .tox/${ENVNAME}/src/horizon
    pip install -U -t .tox/${ENVNAME}/lib/${BASEPYTHON}/site-packages/ .tox/${ENVNAME}/src/horizon
elif [ ${COMMAND} = "post" ]; then
    # crean-up
    rm -fr .tox/${ENVNAME}/src/
    mv .tox/${ENVNAME}/log/ .tox/${ENVNAME}-log/
    rm -fr .tox/${ENVNAME}/
fi

