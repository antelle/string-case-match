module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true,
                browsers: ["PhantomJS"]
            }
        },
        clean: {
            build: {
                options: {
                    force: true
                },
                src: ["build/"]
            }
        },
        uglify: {
            src: {
                options: {
                    banner: "/*! <%= pkg.name %> v<%= pkg.version %>  | (c) <%= grunt.template.today('yyyy') %> Antelle | https://github.com/antelle/string-case-match/blob/master/MIT-LICENSE.txt */\n\n",
                },
                files: {
                    "build/string-case-match.js": ["string-case-match.js"]
                }
            }
        },
        copy: {
            src: {
                files: [
                    { expand: false, src: ["package.json"], dest: "build/package.json" }
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-karma");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", ["karma", "clean", "uglify", "copy"]);

};
