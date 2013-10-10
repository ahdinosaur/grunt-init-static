/*
 * grunt-init-static
 * https://gruntjs.com/
 *
 * Copyright (c) 2013 Michael Williams
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'create a static site with wintersmith, bower, browserify, bootstrap, grunt, nunchuks, less, font awesome, and more.';

// template-specific notes to be displayed before question prompts.
exports.notes = 'you are beautiful <3'

// template-specific notes to be displayed after question prompts.
exports.after = 'you should now install project dependencies with _bower ' +
  'install_, then _npm install_. after that, you may execute project ' + 
  'tasks with _grunt_. for more information about installing and ' + 
  'configuring Grunt, please see the Getting Started guide:' +
  '\n\n' +
  'http://gruntjs.com/getting-started';

// any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// the actual init template.
exports.template = function(grunt, init, done) {

  init.process({}, [
    // prompt for these values.
    init.prompt('name'),
    init.prompt('description', 'the best site ever.'),
    init.prompt('url', 'http://localhost:8088'),
    init.prompt('keywords', 'super, cool, awesome'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses', 'MIT'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
  ], function(err, props) {
    // a few additional properties.

    // files to copy (and process).
    var files = init.filesToCopy(props);

    // add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // actually copy (and process) files.
    init.copyAndProcess(files, props, {
      noProcess: 'templates/**'
    });

    // generate package.json file, used by npm and grunt.
    init.writePackageJSON('package.json', {
      name: props.name,
      description: props.description,
      version: '0.0.0',
      author: {
        name: props.author_name,
        email: props.author_email,
        url: props.author_url
      },
      license: props.license,
      keywords: props.keywords.split(',').map(function (s) { return s.trim(); }),
      private: true,
      dependencies: {
        "browsernizr": "~1.0.0",
        "es5-shim": "~2.1.0",
        "lodash": "~2.2.0",
      },
      devDependencies: {
        "grunt": "~0.4.1",
        "grunt-contrib-clean": "~0.5.0",
        "grunt-contrib-concat": "~0.3.0",
        "grunt-contrib-cssmin": "~0.6.1",
        "grunt-contrib-less": "~0.7.0",
        "grunt-contrib-uglify": "~0.2.2",
        "grunt-contrib-watch": "~0.5.1",
        "grunt-express": "~1.0.0-beta2",
        "grunt-gh-pages": "~0.7.0",
        "grunt-wintersmith": "0.0.2",
        "wintersmith": "~2.0.7",
        "wintersmith-nunjucks": "~0.2.1",
        "grunt-contrib-copy": "~0.4.1",
        "grunt-livescript": "~0.5.0",
        "grunt-spritesmith": "~1.10.1",
        "grunt-hashres": "~0.3.2",
        "grunt-browserify": "~1.2.8",
        "debowerify": "~0.1.8",
        "decomponentify": "0.0.3",
        "deamdify": "~0.1.1",
        "brfs": "0.0.8",
        "deglobalify": "0.0.1",
        "grunt-contrib-jshint": "~0.6.4",
      },
      npm_test: '',
      node_version: '>= 0.8.0',
      repository: "none",
    });

    // generate bower.json file, used by bower.
    init.writePackageJSON('bower.json', {
      name: props.name,
      version: '0.0.0',
      license: props.license, 
      ignore: [
        "**/.*",
        "node_modules",
        "bower_components",
        "test",
        "tests",
      ],
      dependencies: {
        "html5shiv": "~3.7.0",
        "font-awesome": "~3.2.1",
        "jquery": "~2.0.3",
        "bootstrap": "~3.0.0",
      },
      devDependencies: {}
    });

    // all done!
    done();
  });

};
