module.exports = function(grunt){

    require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        tag: {
            banner: '/*! <%= pkg.name %> v<%= pkg.version %> | (c) <%= grunt.template.today(\'yyyy\') %> Kaspars Bulins http://webit.lv */\n',
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commit: false,
                push: false,
                createTag: false
            }
        },/*,
        sass: {
            dist: {
                files: {
                    'build/site.css': 'assets/sass/main.scss' 
                }
            }
        },*/
        copy: {
            vendors: {
                files: [
                    // Requirejs
                    {
                        src: 'bower_components/requirejs/require.js', 
                        dest: 'assets/js/vendor/require.js'
                    },
                    // React
                    {
                        src: 'bower_components/react/react.min.js', 
                        dest: 'assets/js/vendor/react.js'
                    },
                    // jQuery
                    {
                        src: 'bower_components/jquery/dist/jquery.min.js', 
                        dest: 'assets/js/vendor/jquery.js'
                    },
                    // Backbone
                    {
                        src: 'bower_components/backbone/backbone.js', 
                        dest: 'assets/js/vendor/backbone.js'
                    },
                    // Underscore
                    {
                        src: 'bower_components/underscore/underscore-min.js', 
                        dest: 'assets/js/vendor/underscore.js'
                    },
                    // Velocity
                    {
                        src: 'bower_components/velocity/velocity.ui.min.js', 
                        dest: 'assets/js/vendor/velocity.js'
                    }
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'assets/js',
                    include: 'app',
                    out: 'build/app.js',
                    wrap: true,
                    optimize: 'none',
                    onModuleBundleComplete: function (data) {
                        var fs = require('fs'),
                            amdclean = require('amdclean'),
                            outputFile = data.path;

                        fs.writeFileSync(outputFile, amdclean.clean({
                            'filePath': outputFile
                        }));
                    }
                }
            }
        },
        uglify: {
            build: {
                files: {
                    'build/app.min-<%= pkg.version %>.js': ['build/app.js'],
                },
                options: {
                    banner: '<%= tag.banner %>'
                }
            }
        },
        watch: {
            js: {
                files: 'assets/js/*.js',
                tasks: ['requirejs']
            }
        }
    });

    grunt.registerTask('default', ['watch']);
    grunt.registerTask('publish_vendors', ['copy:vendors']);
    grunt.registerTask('build', ['bump', 'requirejs', 'uglify']);
};