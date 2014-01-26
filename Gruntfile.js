// Gruntfile
/*jslint devel: true, node: true, white:true */
'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);
    
    // Configuration Variables
    var configuration = {
        hostname: "localhost",
        port: 8886
    };
    
    // Start configuring grunt
    grunt.initConfig({
        conf: configuration,
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
        express: {
            options: {
                port: "<%= conf.port %>",
                hostname: "<%= conf.hostname %>"
            },
            livereload : {
                options: {
                    livereload: true,
                    bases: ['www']
                }
            }
        },
        open: {
            devel: {
                url: "http://<%= conf.hostname %>:<%= conf.port %>/"
            }
        }
    });
    
    /* BASIC TASKS */
    grunt.registerTask('setup', ['bower:setup', 'copy:setup-www']);
    //grunt.registerTask('devel', ['connect:devel', 'watch:dev']);
    grunt.registerTask('devel', [
        'express:livereload', 'open', 'watch'
    ]);
    
    /* Dummy task */
    grunt.registerTask('dummy', 'Just print a message', function () {
        grunt.log.write("Dummy task called.");
    });
    
};