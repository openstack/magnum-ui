/*
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var child_process = require("child_process");

module.exports = function (config) {
  // This tox venv is setup in the post-install npm step
  var pythonVersion = "python3.";
  var stdout = child_process.execFileSync("python3", ["--version"]);
  pythonVersion += stdout.toString().split(".")[1];
  var toxPath = '../.tox/karma/lib/' + pythonVersion + '/site-packages/';
  console.log("Karma will check on directory: ", toxPath);


  process.env.PHANTOMJS_BIN = 'node_modules/phantomjs-prebuilt/bin/phantomjs';

  config.set({
    preprocessors: {
      // Used to collect templates for preprocessing.
      // NOTE: the templates must also be listed in the files section below.
      './static/**/*.html': ['ng-html2js'],
      // Used to indicate files requiring coverage reports.
      './static/**/!(*.spec).js': ['coverage'],
    },

    // Sets up module to process templates.
    ngHtml2JsPreprocessor: {
      prependPrefix: '/',
      moduleName: 'templates'
    },

    basePath: './',

    // Contains both source and test files.
    files: [
      /*
       * shim, partly stolen from /i18n/js/horizon/
       * Contains expected items not provided elsewhere (dynamically by
       * Django or via jasmine template.
       */
      '../test-shim.js',

      // from jasmine.html
      toxPath + 'xstatic/pkg/jquery/data/jquery.js',
      toxPath + 'xstatic/pkg/angular/data/angular.js',
      toxPath + 'xstatic/pkg/angular/data/angular-route.js',
      toxPath + 'xstatic/pkg/angular/data/angular-mocks.js',
      toxPath + 'xstatic/pkg/angular/data/angular-cookies.js',
      toxPath + 'xstatic/pkg/angular_bootstrap/data/angular-bootstrap.js',
      toxPath + 'xstatic/pkg/angular_gettext/data/angular-gettext.js',
      toxPath + 'xstatic/pkg/angular/data/angular-sanitize.js',
      toxPath + 'xstatic/pkg/d3/data/d3.js',
      toxPath + 'xstatic/pkg/rickshaw/data/rickshaw.js',
      toxPath + 'xstatic/pkg/angular_smart_table/data/smart-table.js',
      toxPath + 'xstatic/pkg/angular_lrdragndrop/data/lrdragndrop.js',
      toxPath + 'xstatic/pkg/spin/data/spin.js',
      toxPath + 'xstatic/pkg/spin/data/spin.jquery.js',
      toxPath + 'xstatic/pkg/tv4/data/tv4.js',
      toxPath + 'xstatic/pkg/objectpath/data/ObjectPath.js',
      toxPath + 'xstatic/pkg/angular_schema_form/data/schema-form.js',
      toxPath + 'xstatic/pkg/angular_fileupload/data/ng-file-upload.js',


      // TODO: These should be mocked.
      toxPath + 'horizon/static/horizon/js/horizon.js',

      /**
       * Include framework source code from horizon that we need.
       * Otherwise, karma will not be able to find them when testing.
       * These files should be mocked in the foreseeable future.
       */
      toxPath + 'horizon/static/framework/**/*.module.js',
      toxPath + 'horizon/static/framework/**/!(*.spec|*.mock).js',
      toxPath + 'openstack_dashboard/static/**/*.module.js',
      toxPath + 'openstack_dashboard/static/**/!(*.spec|*.mock).js',
      toxPath + 'openstack_dashboard/dashboards/**/static/**/*.module.js',
      toxPath + 'openstack_dashboard/dashboards/**/static/**/!(*.spec|*.mock).js',

      /**
       * First, list all the files that defines application's angular modules.
       * Those files have extension of `.module.js`. The order among them is
       * not significant.
       */
      './static/**/*.module.js',

      /**
       * Followed by other JavaScript files that defines angular providers
       * on the modules defined in files listed above. And they are not mock
       * files or spec files defined below. The order among them is not
       * significant.
       */
      './static/**/!(*.spec|*.mock).js',

      /**
       * Then, list files for mocks with `mock.js` extension. The order
       * among them should not be significant.
       */
      toxPath + 'openstack_dashboard/static/**/*.mock.js',

      /**
       * Finally, list files for spec with `spec.js` extension. The order
       * among them should not be significant.
       */
      './static/**/*.spec.js',

      /**
       * Angular external templates
       */
      './static/**/*.html'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    // browsers: ['Chrome'],
    browsers: ['Firefox'],

    browserNoActivityTimeout: 60000,

    reporters: ['progress', 'coverage', 'threshold'],

    plugins: [
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
      'karma-threshold-reporter'
    ],

    // Places coverage report in HTML format in the subdirectory below.
    coverageReporter: {
      type: 'html',
      dir: '../cover/karma/'
    },

    // Coverage threshold values.
    thresholdReporter: {
      statements: 85, // target 100
      branches: 60, // target 100
      functions: 80, // target 100
      lines: 85 // target 100
    }
  });
};
