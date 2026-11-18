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

"""Base test class for Playwright integration tests."""

import os
import re
import time

import fixtures
from keystoneauth1 import identity
from keystoneauth1 import session as keystone_session
from magnumclient import client as magnum_client
import openstack
from oslo_log import log
from oslotest import base
from playwright import sync_api
from testtools import content

from magnum_ui.test.integration_tests import playwright_config as config


LOG = log.getLogger(__name__)


def _safe_name(name):
    return re.sub(r'[^A-Za-z0-9_.-]+', '_', name)


class PlaywrightFixture(fixtures.Fixture):
    """Manage the Playwright browser, context and page lifecycle.

    Videos and traces are recorded according to PLAYWRIGHT_VIDEO and
    PLAYWRIGHT_TRACE. In 'retain-on-failure' mode they are only kept
    when ``failed`` has been set to True by the test case. Saved artifacts
    are reported through the ``add_artifact(kind, path)`` callback.
    """

    def __init__(self, test_name, add_artifact=None):
        super().__init__()
        self.test_name = _safe_name(test_name)
        self.add_artifact = add_artifact
        self.failed = False
        self.page = None

    def _setUp(self):
        self.playwright = sync_api.sync_playwright().start()
        self.addCleanup(self.playwright.stop)

        launcher = getattr(self.playwright, config.get_browser())
        self.browser = launcher.launch(headless=config.is_headless())
        self.addCleanup(self.browser.close)

        context_kwargs = {
            'viewport': {'width': 1920, 'height': 1080},
            'ignore_https_errors': config.ignore_https_errors(),
        }
        if config.get_video_mode() != 'off':
            os.makedirs(config.get_video_dir(), exist_ok=True)
            context_kwargs.update({
                'record_video_dir': config.get_video_dir(),
                'record_video_size': {'width': 1920, 'height': 1080},
            })

        self.context = self.browser.new_context(**context_kwargs)
        self.context.set_default_timeout(config.get_timeout())
        self.addCleanup(self._close_context_and_finalize_artifacts)

        if config.get_trace_mode() != 'off':
            self.context.tracing.start(screenshots=True, snapshots=True,
                                       sources=True, name=self.test_name)

        self.page = self.context.new_page()

    def _keep(self, mode):
        return mode == 'on' or (mode == 'retain-on-failure' and self.failed)

    def _close_context_and_finalize_artifacts(self):
        trace_mode = config.get_trace_mode()
        if trace_mode != 'off':
            trace_path = None
            if self._keep(trace_mode):
                os.makedirs(config.get_trace_dir(), exist_ok=True)
                trace_path = os.path.join(config.get_trace_dir(),
                                          'trace_%s.zip' % self.test_name)
            try:
                self.context.tracing.stop(path=trace_path)
                if trace_path:
                    self._report_artifact('trace', trace_path)
            except sync_api.Error as e:
                LOG.warning("Failed to save trace: %s", e)

        self.context.close()

        if self.page.video:
            if self._keep(config.get_video_mode()):
                video_path = os.path.join(config.get_video_dir(),
                                          'video_%s.webm' % self.test_name)
                self.page.video.save_as(video_path)
                self._report_artifact('video', video_path)
            self.page.video.delete()

    def _report_artifact(self, kind, path):
        LOG.info("%s saved to: %s", kind.capitalize(), path)
        if self.add_artifact:
            self.add_artifact(kind, path)


class MagnumClientFixture(fixtures.Fixture):
    """Provide a python-magnumclient instance for API checks and cleanup."""

    def _setUp(self):
        auth = identity.Password(
            auth_url=config.get_auth_url(),
            username=config.get_username(),
            password=config.get_password(),
            project_name=config.get_project_name(),
            user_domain_name=config.get_user_domain_name(),
            project_domain_name=config.get_project_domain_name(),
        )
        session = keystone_session.Session(auth=auth,
                                           verify=not config.is_insecure())
        self.session = session
        self.client = magnum_client.Client('1', session=session)


class PlaywrightTestCase(base.BaseTestCase):
    """Base test case for Magnum UI integration tests."""

    # Convenience alias for Playwright expect assertions
    expect = sync_api.expect

    # Subclasses can set this to False to skip the automatic login in setUp()
    auto_login = True

    # Subclasses can set this to True when a test deliberately triggers
    # error messages (e.g. policy checks), to skip assert_no_errors()
    allow_errors = False

    def setUp(self):
        super().setUp()
        self.dashboard_url = config.get_dashboard_url()
        # The default of 5s is too short e.g. for the first login
        self.expect.set_options(timeout=config.get_timeout())

        magnum_fixture = self.useFixture(MagnumClientFixture())
        self.magnum_client = magnum_fixture.client
        self.project_id = magnum_fixture.session.get_project_id()
        self.session = magnum_fixture.session

        self._screenshot_counter = 0
        self._screenshot_dir = None
        if config.is_screenshot_enabled():
            self._screenshot_dir = os.path.join(config.get_screenshot_dir(),
                                                _safe_name(self.id()))
            os.makedirs(self._screenshot_dir, exist_ok=True)

        self.pw_fixture = self.useFixture(
            PlaywrightFixture(self.id(), self.add_artifact_detail))
        self.page = self.pw_fixture.page
        self.addOnException(self._on_exception)

        self._server_errors = []
        self.page.on('response', self._record_server_error)
        if not self.allow_errors:
            # Cleanups run in reverse order, so this runs while the
            # page is still open.
            self.addCleanup(self._assert_no_errors_on_cleanup)

        if self.auto_login:
            self.login()

    def _record_server_error(self, response):
        if '/api/' in response.url and response.status >= 500:
            self._server_errors.append(
                '%s %s -> %s' % (response.request.method, response.url,
                                 response.status))

    def assert_no_errors(self):
        """Fail if Horizon showed error messages or its REST API failed.

        Horizon reports failed API calls (e.g. "Unable to retrieve the
        clusters.") as error toasts or messages instead of failing the
        page, and error toasts are not auto-dismissed.
        """
        messages = self.page.locator('.alert-danger:visible').all_inner_texts()
        messages = [' '.join(m.split()) for m in messages]
        self.assertEqual([], messages, 'Horizon showed error messages')
        self.assertEqual([], self._server_errors,
                         'Horizon REST API returned server errors')

    def add_artifact_detail(self, kind, path):
        """Reference an artifact in the test result (e.g. testr_results.html).

        The path is made relative to the parent of the output directory, so
        it starts with 'playwright/' - which is also where Zuul copies the
        output directory, next to testr_results.html.
        """
        rel_path = os.path.relpath(
            path, os.path.dirname(config.get_output_dir()))
        self.addDetail('%s %s' % (kind, os.path.basename(path)),
                       content.text_content(rel_path))

    def _assert_no_errors_on_cleanup(self):
        # Don't report the same errors again if the test already failed
        if not self.pw_fixture.failed:
            self.assert_no_errors()

    def _on_exception(self, exc_info):
        # Also called for exceptions raised in cleanups (assert_no_errors)
        self.pw_fixture.failed = True
        path = self.take_screenshot('failure')
        if path:
            self.add_artifact_detail('screenshot', path)

    def login(self, username=None, password=None):
        """Log in to the dashboard, by default with the admin credentials."""
        self.page.goto(self.dashboard_url)
        self.take_screenshot('login_page')
        self.page.get_by_label('User Name').fill(
            username or config.get_username())
        self.page.get_by_label('Password').fill(
            password or config.get_password())
        self.page.locator('#loginBtn').click()
        self.expect(self.page).not_to_have_url(re.compile(r'.*/auth/login.*'))
        if username is None:
            # Horizon may pick another project the admin user is a member
            # of, use the same project as the API client
            self.page.goto(
                '%s/auth/switch/%s/' % (self.dashboard_url, self.project_id))
            self.page.wait_for_load_state('networkidle')
        self.take_screenshot('logged_in')

    def goto_panel(self, dashboard, panel):
        """Open a panel by its dashboard and panel slugs."""
        self.page.goto('%s/%s/%s/' % (self.dashboard_url, dashboard, panel))
        self.page.wait_for_load_state('networkidle')
        if not self.allow_errors:
            self.assert_no_errors()

    def open_modal(self, action_button):
        """Click an action button and return the opened modal dialog."""
        action_button.click()
        # Skip horizon's "Loading..." wait spinner, which some actions show
        # while preparing the form and which can briefly overlap with it
        modal = self.page.locator(
            '.modal:not(.modal-wait-spinner) .modal-dialog')
        self.expect(modal).to_be_visible()
        return modal

    def submit_modal(self, modal):
        modal.locator('.modal-footer .btn-primary').click()
        self.expect(modal).to_be_hidden()

    def create_keypair(self, name):
        """Create a Nova keypair, deleted again on cleanup."""
        compute = openstack.connection.Connection(session=self.session).compute
        compute.create_keypair(name=name)
        self.addCleanup(compute.delete_keypair, name, ignore_missing=True)

    def wait_for(self, predicate, timeout, message, interval=30):
        """Poll predicate() until it returns a true value and return it."""
        deadline = time.monotonic() + timeout
        while True:
            result = predicate()
            if result:
                return result
            if time.monotonic() > deadline:
                self.fail('Timed out after %ss waiting for %s'
                          % (timeout, message))
            time.sleep(interval)

    def goto_wizard_step(self, modal, title):
        modal.locator('.wizard-nav li', has_text=title).click()

    def wait_for_success_message(self):
        self.expect(
            self.page.locator('.alert-success').first
        ).to_be_visible()

    def take_screenshot(self, name):
        """Take a numbered screenshot into the per-test directory."""
        if not self._screenshot_dir:
            return None
        self._screenshot_counter += 1
        path = os.path.join(self._screenshot_dir,
                            '%03d_%s.png' % (self._screenshot_counter, name))
        try:
            self.page.screenshot(path=path)
        except sync_api.Error as e:
            LOG.warning("Failed to take screenshot %s: %s", name, e)
            return None
        return path
