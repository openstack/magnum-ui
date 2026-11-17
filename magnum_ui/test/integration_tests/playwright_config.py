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

"""Centralized configuration for Playwright integration tests.

All values are read from environment variables set by tox.ini
(see the ``integration`` testenv).
"""

import functools
import os

from oslo_utils import strutils


VALID_BROWSERS = ('chromium', 'firefox', 'webkit')
VALID_RECORDING_MODES = ('off', 'on', 'retain-on-failure')


# OpenStack configuration


@functools.cache
def get_username():
    return os.environ['OS_USERNAME']


@functools.cache
def get_password():
    return os.environ['OS_PASSWORD']


@functools.cache
def get_demo_username():
    """Non-admin user, used for policy checks."""
    return os.environ['OS_DEMO_USERNAME']


@functools.cache
def get_demo_password():
    return os.environ['OS_DEMO_PASSWORD']


@functools.cache
def get_auth_url():
    return os.environ['OS_AUTH_URL']


@functools.cache
def get_project_name():
    return os.environ['OS_PROJECT_NAME']


@functools.cache
def get_user_domain_name():
    return os.environ['OS_USER_DOMAIN_NAME']


@functools.cache
def get_project_domain_name():
    return os.environ['OS_PROJECT_DOMAIN_NAME']


@functools.cache
def is_insecure():
    return strutils.bool_from_string(os.environ['OS_INSECURE'], strict=True)


# Dashboard and browser configuration


@functools.cache
def get_dashboard_url():
    return os.environ['MAGNUM_DASHBOARD_URL'].rstrip('/')


@functools.cache
def get_image():
    """Image with an os_distro supported by the installed Magnum driver."""
    return os.environ['MAGNUM_IMAGE']


@functools.cache
def get_external_network():
    return os.environ['MAGNUM_EXTERNAL_NETWORK']


@functools.cache
def get_flavor():
    return os.environ['MAGNUM_FLAVOR']


@functools.cache
def get_network_driver():
    return os.environ['MAGNUM_NETWORK_DRIVER']


@functools.cache
def cluster_tests_enabled():
    """Cluster lifecycle tests need a Cluster API management cluster."""
    return strutils.bool_from_string(os.environ['MAGNUM_CLUSTER_TESTS'],
                                     strict=True)


@functools.cache
def get_cluster_timeout():
    """Timeout for cluster create/delete in seconds."""
    return int(os.environ['MAGNUM_CLUSTER_TIMEOUT'])


@functools.cache
def get_browser():
    browser = os.environ['PLAYWRIGHT_BROWSER'].lower()
    if browser not in VALID_BROWSERS:
        raise ValueError("Invalid browser '%s'. Must be one of: %s"
                         % (browser, VALID_BROWSERS))
    return browser


@functools.cache
def is_headless():
    return strutils.bool_from_string(os.environ['PLAYWRIGHT_HEADLESS'],
                                     strict=True)


@functools.cache
def get_timeout():
    """Default timeout for Playwright operations in milliseconds."""
    return int(os.environ['PLAYWRIGHT_TIMEOUT'])


@functools.cache
def ignore_https_errors():
    value = os.environ.get('PLAYWRIGHT_IGNORE_HTTPS_ERRORS', 'False')
    return strutils.bool_from_string(value, default=False)


# Artifacts (screenshots, videos, traces)


@functools.cache
def get_output_dir():
    return os.environ['PLAYWRIGHT_OUTPUT_DIR']


@functools.cache
def get_screenshot_dir():
    return os.path.join(get_output_dir(), 'screenshots')


@functools.cache
def get_video_dir():
    return os.path.join(get_output_dir(), 'videos')


@functools.cache
def get_trace_dir():
    return os.path.join(get_output_dir(), 'traces')


@functools.cache
def is_screenshot_enabled():
    return strutils.bool_from_string(os.environ['PLAYWRIGHT_SCREENSHOTS'],
                                     strict=True)


def _get_recording_mode(env_var):
    mode = os.environ[env_var].lower()
    if mode not in VALID_RECORDING_MODES:
        raise ValueError("Invalid %s '%s'. Must be one of: %s"
                         % (env_var, mode, VALID_RECORDING_MODES))
    return mode


@functools.cache
def get_video_mode():
    return _get_recording_mode('PLAYWRIGHT_VIDEO')


@functools.cache
def get_trace_mode():
    return _get_recording_mode('PLAYWRIGHT_TRACE')
