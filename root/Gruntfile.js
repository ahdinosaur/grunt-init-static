module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-wintersmith');
  grunt.loadNpmTasks('grunt-livescript');
  grunt.loadNpmTasks('grunt-spritesmith');
  grunt.loadNpmTasks('grunt-hashres');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['preview']);
  grunt.registerTask('generate', ['wintersmith']);
  grunt.registerTask('styles', ['less']);
  grunt.registerTask('scripts', ['livescript', 'browserify'])
  grunt.registerTask('build', ['clean', 'generate', 'sprite', 'styles', 'scripts', 'concat', 'copy']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('server', ['express']);
  grunt.registerTask('preview', ['build', 'server', 'watch']);
  grunt.registerTask('minify', ['cssmin', 'uglify']);
  grunt.registerTask('deploy', ['build', 'minify', 'hashres', 'gh-pages']);

  var jsVendors = [
    'bower_components/jquery/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
  ],
      defaultBanner = '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
      lessPaths = [
    'bower_components/bootstrap/less/',
    'bower_components/font-awesome/less/',
    'styles/',
    '/build/styles/',
  ],
      fontFiles = [
    'bower_components/bootstrap/fonts/*',
    'bower_components/font-awesome/font/*',
  ];

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: ['build'],

    wintersmith: {
      build: {},
    },

    copy: {
      fonts: {
        src: fontFiles,
        dest: 'build/fonts/',
        expand: true,
        flatten: true,
        filter: 'isFile',
      },
      scripts: {
        src: 'scripts/**/*.js',
        dest: 'build/scripts/',
      },
    },

    sprite: {
      build: {
        src: 'media/sprites/*.png',
        destImg: 'build/media/spritesheet.png',
        destCSS: 'build/styles/mysprites.less',
      },
    },

    less: {
      options: {
        paths: lessPaths,
        compress: false,
      },
      build: {
        src: 'styles/main.less',
        dest: 'build/styles/main.css',
      },
    },

    livescript: {
      build: {
        expand: true,
        cwd: 'scripts/',
        src: '**/*.live',
        dest: 'build/scripts/',
        ext: '.js',
      },
    },

    browserify: {
      vendor: {
        src: jsVendors,
        dest: 'build/scripts/vendor.js',
        options: {
          shim: {
            jQuery: {
              path: jsVendors[0],
              exports: '$',
            },
            bootstrap: {
              path: jsVendors[1],
              exports: null,
              depends: { jQuery: '$'},
            },
          },
        },
      },
      app: {
        src: 'build/scripts/**/!(vendor).js',
        dest: 'build/scripts/app.js',
        options: {
          transform: ['brfs', 'debowerify', 'decomponentify', 'deamdify', 'deglobalify'],
          external: ['jQuery'],
        },
      },
    },

    concat: {
      options: {
        banner: defaultBanner,
      },
      build: {
        files: {
          'build/scripts/main.js': ['/build/scripts/vendor.js', '/build/scripts/app.js'],
          'build/scripts/html5shiv.js': 'bower_components/html5shiv/dist/html5shiv.js',
        },
      },
    },

    jshint: {
      all: ['Gruntfile.js', 'config.json', 'scripts/**/*.js'],
    },

    express: {
      server: {
        options: {
          bases: 'build',
          livereload: true,
          port: 8088,
        },
      },
    },

    watch: {
      all: {
        files: ['Gruntfile.js'],
        tasks: ['build'],
      },
      generate: {
        files: [
          '/contents/**',
          '/templates/**',
        ],
        tasks: ['wintersmith'],
      },
      styles: {
        files: ['/styles/**'],
        tasks: ['styles']
      },
      scripts: {
        files: ['/scripts/**'],
        tasks: ['scripts']
      },
    },

    cssmin: {
      options: {
        banner: defaultBanner,
        report: 'min',
      },
      'build/styles/main.css': '/build/styles/main.css',
    },

    uglify: {
      options: {
        banner: defaultBanner,
        report: 'min',
      },
      'build/scripts/main.js': '/build/scripts/main.js',
    },

    hashres: {
      options: {},
      deploy: {
        src: [
          '/build/scripts/main.js',
          '/build/styles/main.css',
        ],
        dest: 'build/index.html',
      },
    },

    'gh-pages': {
      deploy: {
        options: {
          base: 'build',
          repo: 'https://github.com/{%= author_name %}/{%= name %}.git',
          branch: 'gh-pages',
          message: defaultBanner,
        },
        src: ['**/*'],
      },
    },

  });

};
