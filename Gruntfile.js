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
            e2e: {
                configFile: 'karma-e2e.conf.js'
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
        },

        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost'
            },
            e2e: {
                options: {
                    base: [
                        '.tmp',
                        'src',
                        'test/app',
                        'test/support'
                    ],
                    middleware: function(connect, options) {
                        var middleware = options.base.map(function(b) {
                            return connect.static(b);
                        });
                        middleware.push(function(req, res) {
                            res.statusCode = 200;
                            var data = '';
                            req.on('data', function(chunk) {
                                data += chunk.toString();
                            });
                            req.on('end', function() {
                                var user = data && (user = JSON.parse(data)) && user.user;
                                var isAuthenticated = (user && Object.keys(user).length > 0 &&
                                                       (user.password || user.email && user.email.indexOf('@') > -1)
                                                      );
                                if (!isAuthenticated && req.url === '/auth' && req.method === 'POST') {
                                    res.statusCode = 401;
                                }
                                res.end(data || '');
                            });
                        });
                        return middleware;
                    }
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    // Default task.
    grunt.registerTask('lint-test', 'jshint:test');
    grunt.registerTask('test:unit', ['ngtemplates', 'karma:unit']);
    grunt.registerTask('test:e2e', ['ngtemplates', 'connect:e2e', 'karma:e2e']);
    grunt.registerTask('test', ['test:e2e']);
    grunt.registerTask('server', ['connect:e2e:keepalive']);

    grunt.registerTask('default', ['jshint:devise', 'test', 'ngtemplates', 'preprocess', 'ngmin', 'uglify']);

};
