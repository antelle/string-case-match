module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true
            },
            all: ['*.js', 'spec/**/*.js']
        },
        'jasmine_node': {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: ['spec/']
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
        clean: {
            build: {
                options: {
                    force: true
                },
                src: ['dist/']
            }
        },
        uglify: {
            src: {
                options: {
                    banner: '/*! <%= pkg.name %> v<%= pkg.version %>  | (c) <%= grunt.template.today(\'yyyy\') %> Antelle | ' +
                        'https://github.com/antelle/string-case-match/blob/master/MIT-LICENSE.txt */\n\n',
                    beautify : {
                        'ascii_only': true
                    }
                },
                files: {
                    'dist/string-case-match.js': ['string-case-match.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint', 'jasmine_node', 'karma', 'clean', 'uglify']);

};
