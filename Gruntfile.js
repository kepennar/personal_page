// Generated on 2014-01-30 using generator-jhipster 0.8.4
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt); 

  grunt.initConfig({
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },
    watch: {
    styles: {
        files: ['app/css/{,*/}*.*'],
        tasks: ['compass:dev', 'copy:styles', 'autoprefixer']
      },
    livereload: {
        options: {
          livereload: 35729
        },
        files: [
          'app/{,*/}*.html',
          '.tmp/css/{,*/}*.css',
          '{.tmp/,}js/{,*/}*.js',
          'app/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },
    autoprefixer: {
      options: ['last 1 version'],
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/css/',
          src: '{,*/}*.css',
          dest: '.tmp/css/'
        }]
      }
    },
    connect: {
      proxies: [
        {
          context: '/app',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        },
        {
          context: '/metrics',
          host: 'localhost',
          port: 8080,
          https: false,
          changeOrigin: false
        }
      ],
      options: {
        port: 9000,
        // Change this to 'localhost' to deny access to the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            'app/'
          ],
          middleware: function (connect) {
            return [
              proxySnippet,
              connect.static(require('path').resolve('app/'))
            ];
          }
        }
      },
      test: {
        options: {
         port: 9001,
          base: [
            '.tmp',
            'test',
            'app/'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'app/js/{,*/}*.js'
      ]
    },
    coffee: {
      options: {
        sourceMap: true,
        sourceRoot: 'app/'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app/js',
          src: '{,*/}*.coffee',
          dest: '.tmp/js',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      dev: {
        options: {
          sassDir: 'app/css',
          cssDir: 'app/css', 
          outputStyle: 'expanded'
        }
      },
      dist: {
        options: {
          sassDir: 'app/css',
          cssDir: '<%= yeoman.dist %>/css',
          outputStyle: 'compressed',
          environment: 'production'
        }
      }
    },
    // not used since Uglify task does concat,
    // but still available if needed
    /*concat: {
      dist: {}
    },*/
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/js/{,*/}*.js',
            '<%= yeoman.dist %>/css/{,*/}*.css',
            '<%= yeoman.dist %>/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ]
        }
      }
    },
    useminPrepare: {
      html: 'app/{,*/}*.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },
    usemin: {
      html: '<%= yeoman.dist %>/{,*/}*.html',
      css: '<%= yeoman.dist %>/css/{,*/}*.css',
      js: '<%= yeoman.dist %>/js/*.js',
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/img', '<%= yeoman.dist %>/fonts'],
        patterns: {
          // FIXME While usemin won't have full support for revved files we have to put all references manually here
          js: [
              [/(img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          optimizationLevel : '7',
          cwd: 'app/img',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/img',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/img'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          //removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          //collapseBooleanAttributes: true,
          //removeAttributeQuotes: true,
          //removeRedundantAttributes: true,
          //useShortDoctype: true,
          //removeEmptyAttributes: true,
          //removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['*.html', 'views/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },
    // Put files not handled in other tasks here
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app/',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'app/img/{,*/}*.{gif,webp}',
            'fonts/{,*/}*',
            'css/{,*/}*.css'
          ]
        }, {
          expand: true,
          cwd: '.tmp/img',
          dest: '<%= yeoman.dist %>/img',
          src: [
            'generated/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: 'app/css',
        dest: '.tmp/css/',
        src: '{,*/}*.css'
      }
    },
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/js',
          src: '*.js',
          dest: '.tmp/concat/js'
        }]
      }
    },
    replace: {
      dist: {
        src: ['<%= yeoman.dist %>/index.html'],
          overwrite: true,                 // overwrite matched source files
          replacements: [{
            from: '<div class="development"></div>',
            to: 'app/'
          }]
        }
      },
    uglify: {
      dist: {
        files: {
          '<%= yeoman.dist %>/js/scripts.js': [
            'app/js/{,*/}*.js'
          ]
        }        
      },
      libs: {
        files: [
          {
            expand: true,
            cwd: 'app/bower_components',
            src: ['**/jquery.min.js', '**/handlebars.min.js', '**/collapse.js', '**/skrollr.min.js', '**/modernizr.js'],
            dest: '<%= yeoman.dist %>/bower_components'
          }
        ]
      }
    }
  });

  grunt.registerTask('server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'compass:dev',
      'autoprefixer',
      'configureProxies',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'compass:dist',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'copy:dist',
    'ngmin',
    'replace',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};