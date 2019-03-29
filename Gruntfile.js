'use strict';
const authRequest = require('grunt-connect-http-auth/lib/utils').authRequest;

module.exports = function(grunt) {

	if (!grunt.option("browsers")) {
		grunt.option("browsers", "ChromeHeadless");
	}

	grunt.initConfig({

		connect: {
			auth:{
				authRealm : "sitFFM demo (sitFFM/rockz)",
				authList : ['sitFFM:rockz']
			},
			options: {
				middleware: function(connect, options, middlewares) {
					if (grunt.option('useBasicAuth')) {
						middlewares.push(authRequest);
					}
					return middlewares;
				},
				port: 8080,
				hostname: '*'
			},
			src: {},
			dist: {}
		},

		openui5_connect: {
			options: {
				resources: [
					'bower_components/openui5-sap.ui.core/resources',
					'bower_components/openui5-sap.m/resources',
					'bower_components/openui5-themelib_sap_belize/resources'
				],
				testresources: [
					'bower_components/openui5-sap.ui.core/test-resources',
					'bower_components/openui5-sap.m/test-resources',
					'bower_components/openui5-themelib_sap_belize/test-resources'
				],
				cors: {
					origin: 'http://localhost:<%= karma.options.port %>'
				}
			},
			src: {
				options: {
					appresources: 'webapp'
				}
			},
			dist: {
				options: {
					appresources: 'dist'
				}
			}
		},

		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: 'webapp',
						prefix: 'sap/ui/demo/todo',
						src: [
							'**/*.js',
							'**/*.fragment.html',
							'**/*.fragment.json',
							'**/*.fragment.xml',
							'**/*.view.html',
							'**/*.view.json',
							'**/*.view.xml',
							'**/*.properties',
							'manifest.json',
							'!test/**'
						]
					},
					dest: 'dist'
				},
				components: true
			}
		},

		clean: {
			dist: 'dist',
			coverage: 'coverage'
		},

		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: 'webapp',
					src: [
						'**',
						'!test/**'
					],
					dest: 'dist'
				} ]
			}
		},

		eslint: {
			webapp: ['webapp']
		},

		karma: {
			options: {
				basePath: 'webapp',
				frameworks: ['qunit', 'openui5'],
				openui5: {
					// path: 'http://localhost:8080/resources/sap-ui-core.js'
					path: 'http://openui5.hana.ondemand.com/resources/sap-ui-core.js'
				},
				client: {
					openui5: {
						config: {
							theme: 'sap_belize',
							language: 'EN',
							bindingSyntax: 'complex',
							compatVersion: 'edge',
							preload: 'async',
							resourceRoots: {'sap.ui.demo.todo': './base'}
						},
						tests: [
							'sap/ui/demo/todo/test/unit/allTests',
							'sap/ui/demo/todo/test/integration/AllJourneys'
						]
					}
				},
				files: [
					{ pattern: '**', included: false, served: true, watched: true }
				],
				reporters: ['progress'],
				port: 9876,
				logLevel: 'INFO',
				browserConsoleLogOptions: {
					level: 'warn'
				},
				browsers: ['ChromeHeadless']
			},
			multibrowser: {
				browsers: grunt.option("browsers").split(",")
			},
			ci: {
				singleRun: true,
				browsers: ['ChromeHeadless'],
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					],
					check: {
						each: {
							statements: 100,
							branches: 100,
							functions: 100,
							lines: 100
						}
					}
				},
				reporters: ['progress', 'coverage']
			},
			cimultibrowser: {
				singleRun: true,
				browsers: grunt.option("browsers").split(","),
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					],
					check: {
						each: {
							statements: 100,
							branches: 100,
							functions: 100,
							lines: 100
						}
					}
				},
				reporters: ['progress', 'coverage']
			},
			watch: {
				client: {
					clearContext: false,
					qunit: {
						showUI: true
					}
				}
			},

			coverage: {
				singleRun: true,
				browsers: grunt.option("browsers").split(","),
				preprocessors: {
					'{webapp,webapp/!(test)}/*.js': ['coverage']
				},
				coverageReporter: {
					includeAllSources: true,
					reporters: [
						{
							type: 'html',
							dir: '../coverage/'
						},
						{
							type: 'text'
						}
					]
				},
				reporters: ['progress', 'coverage']
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-connect-http-auth');

	// Server task
	grunt.registerTask('serve', function(target) {
		if (grunt.option('useBasicAuth')) {
			grunt.task.run('configureHttpAuth');
		}
		grunt.task.run('openui5_connect:' + (target || 'src') + ':keepalive');
	});

	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Test tasks
	grunt.registerTask('test', ['clean:coverage', 'openui5_connect:src', 'karma:ci']);
	grunt.registerTask('testMultiBrowser', ['clean:coverage', 'openui5_connect:src', 'karma:cimultibrowser']);
	grunt.registerTask('watch', ['openui5_connect:src', 'karma:watch']);
	grunt.registerTask('watchMultiBrowser', ['openui5_connect:src', 'karma:multibrowser']);
	grunt.registerTask('coverage', ['clean:coverage', 'openui5_connect:src', 'karma:coverage']);

	// Build task
	grunt.registerTask('build', ['clean:dist', 'openui5_preload', 'copy']);

	// Default task
	grunt.registerTask('default', ['serve']);
};
