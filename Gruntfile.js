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
                        expand: true, cwd: "bower_components/angular/",
                        src: 'angular.js', dest: "src/www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/angular-route/",
                        src: 'angular-route.js', dest: "src/www/js/lib/"
                    },
                    {
                        expand: true, cwd: "bower_components/ngInfiniteScroll/",
                        src: 'ng-infinite-scroll.js', dest: "src/www/js/lib/"
                    }
                ]
            }
        }
    });
    
    /* BASIC TASKS */
    grunt.registerTask('setup', ['bower:setup', 'copy:setup-www']);
};