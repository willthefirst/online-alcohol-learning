module.exports = function(grunt) {

  'use strict';
  // Default port
  var LIVERELOAD_PORT = 35729;

  // Project configuration.
  grunt.initConfig({
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'scripts/vendor/jquery-3.2.1.min.js',
          'scripts/main.js'
        ],
        dest: 'public/scripts/built.min.js',
      },
    },
    uglify: {
      build: {
        src: 'public/scripts/built.min.js',
        dest: 'public/scripts/built.min.js'
      }
    },
    connect: {
      server: {
        options: {
          port: 8000,
          base: 'public',
          livereload: LIVERELOAD_PORT
        }
      }
    },
    sass: {                              // Task
      dist: {                            // Target
        files: [{
          expand: true,
          cwd: 'scss',
          src: ['*.scss'],
          dest: 'public/styles',
          ext: '.css'
        }]
      }
    },
    watch: {
      scripts: {
        files: ['scripts/*'],
        tasks:  ['concat', 'uglify'],
        options: {
          livereload: LIVERELOAD_PORT
        }
      },
      css: {
        files: ['scss/*.scss'],
        tasks: ['sass'],
        options: {
          livereload: LIVERELOAD_PORT,
        },
      },
    },
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['connect', 'watch']);
};
