/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            version: '<%= pkg.version %>',
            banner:
                '// AngularDeviseModal\n' +
                '// -------------------\n' +
                '// v<%= pkg.version %>\n' +
                '//\n' +
                '// Copyright (c)<%= grunt.template.today("yyyy") %> Justin Ridgewell\n' +
                '// Distributed under MIT license\n' +
                '//\n' +
                '// https://github.com/cloudspace/angular_devise_modal\n' +
                '\n'
        },

        preprocess: {
            build: {
                files: {
                    'lib/devise-modal.js' : 'src/build/devise-modal.js'
                }
            }
        },

        uglify : {
            options: {
                banner: "<%= meta.banner %>"
            },
            core : {
                src : 'lib/devise-modal.js',
                dest : 'lib/devise-modal-min.js',
            }
        },

        jshint: {
            options: {
                jshintrc : '.jshintrc'
            },
            devise : [ 'src/*.js' ],
            test : [ 'test/*.js', 'test/specs/*.js' ],
        },

        plato: {
            devise : {
                src : 'src/*.js',
                dest : 'reports',
                options : {
                    jshint : false
                }
            }
        },

        ngmin: {
            dist: {
                src: 'lib/devise-modal.js',
                dest: 'lib/devise-modal.js'
            }
        },

        karma: {
            options: {
                configFile: 'karma.conf.js',
                browsers: ['PhantomJS']
            },
            unit: {
            },
            continuous: {
                singleRun: false
            }
        },

        ngtemplates: {
            DeviseModal: {
                cwd: 'src',
                src: '*.html',
                dest: '.tmp/template.js',
                options: {
                    bootstrap: function(module, script) {
                        return 'deviseModal.run(function($templateCache) {' + script + '});';
                    },
                    htmlmin: {
                        collapseWhitespace:             true,
                        removeAttributeQuotes:          true,
                        removeComments:                 true,
                        removeEmptyAttributes:          true,
                        removeRedundantAttributes:      true,
                        removeScriptTypeAttributes:     true,
                        removeStyleLinkTypeAttributes:  true
                    }
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Default task.
    grunt.registerTask('lint-test', 'jshint:test');
    grunt.registerTask('test', function(type) {
        type = type || 'unit';
        grunt.task.run('karma:' + type);
    });
    grunt.registerTask('default', ['jshint:devise', 'test', 'ngtemplates', 'preprocess', 'ngmin', 'uglify']);

};
