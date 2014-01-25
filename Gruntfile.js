// Gruntfile
/*jslint devel: true, node: true, white:true */

module.exports = function (grunt) {
    'use strict';
    require('load-grunt-tasks')(grunt);
    
    grunt.initConfig({
        bower: {
            setup: {
                options: { install: true, copy: false }
            }
        },
        copy: {
            "setup-www": {
                files: [
                    {
                        expand: true, cwd: "bower_components/jquery/",
                        src: 'jquery.js', dest: "www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/angular/",
                        src: 'angular.js', dest: "www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/angular-route/",
                        src: 'angular-route.js', dest: "www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/angular-animate/",
                        src: 'angular-animate.js', dest: "www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/ngInfiniteScroll/",
                        src: 'ng-infinite-scroll.js', dest: "www/js/lib/"
                    }
                ]
            }
        },
        connect: {
            devel: {
                options: {
                    port: 8889,
                    base: 'www',
                    keepalive: true,
                    open: true
                }
            }
        }
    });
    
    /* BASIC TASKS */
    grunt.registerTask('setup', ['bower:setup', 'copy:setup-www']);
    grunt.registerTask('devel', ['connect:devel']);
};