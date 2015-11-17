'use strict';
var _ = require('lodash');

module.exports = function (grunt) {
	var coverage = 100;
	var sourceFiles = ['*.js', 'lib/**/*.js'];
	var testFiles = ['test/**/*.js'];
	var allFiles = sourceFiles.concat(testFiles);

	var defaultJsHintOptions = grunt.file.readJSON('./.jshintrc');
	var testJsHintOptions = _.extend(
		grunt.file.readJSON('./.jshintrc'),
		defaultJsHintOptions
	);
	grunt.initConfig({
		jscs: {
			src: allFiles,
			options: {
				config: '.jscsrc',
				force: true
			}
		},

		jshint: {
			src: sourceFiles,
			options: defaultJsHintOptions,
			test: {
				options: testJsHintOptions,
				files: {
					test: testFiles
				}
			}
		},

		mochaIstanbul: {
			coverage: {
				src: 'test/specs'
			},
			options: {
				coverage: true,
				reporter: 'spec',
				check: {
					lines: coverage,
					statements: coverage
				},
				reportFormats: ['lcov', 'text'],
				print: 'detail'
			}
		},

		clean: [ 'coverage', 'test/temp' ],

		watch: {
			less: {
				files: [ "./less/**" ],
				tasks: [ 'less:default' ]
			},

			client : {
				files : [ "./client/**" ],
				tasks : [ "browserify:client" ]
			}
		},

		less: {
			default: {
				files: {
					'./static/css/style.css': './less/index.less'
				}
			}
		},

		browserify : {
			client : {
				options : {
					browserifyOptions : {
						extensions : [
							'.jsx',
							'.js'
						],
					},

					transform : [
						[ "babelify", { presets : [ 'react', 'es2015' ] } ]
					]
				},
				files   : {
					"./static/js/bandcast.js" : [ "./client/index.jsx" ]
				}
			}
		},

		parallel : {
			assets : {
				options : { grunt : true, stream : true },
				tasks   : [ "watch:client", "watch:less" ]
			}
		}
	});

	grunt.registerTask('setupEnvironment', [], function () {
		function ensureEnvironmentVariable (name, defaultValue) {
			process.env[name] = process.env[name] || defaultValue;
		}

		ensureEnvironmentVariable('NODE_ENV', 'test');
		ensureEnvironmentVariable('DB_NAME', 'test');
		ensureEnvironmentVariable('DB_PASS', '');
		ensureEnvironmentVariable('DB_HOST', 'localhost');
		ensureEnvironmentVariable('DB_PORT', '5434');
		ensureEnvironmentVariable('DB_USER', 'testUser');
	});

	// Load plugins
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jscs');
	grunt.loadNpmTasks('grunt-mocha-istanbul');
	grunt.loadNpmTasks("grunt-browserify");
	grunt.loadNpmTasks("grunt-parallel");

	// Rename tasks
	grunt.task.renameTask('mocha_istanbul', 'mochaIstanbul');

	// Register tasks
	grunt.registerTask('assets', [ 'less:default', 'browserify:client' ]);
	grunt.registerTask('dev', [ 'assets', 'parallel:assets' ]);
	grunt.registerTask('test', [ 'mochaIstanbul:coverage' ]);
	grunt.registerTask('lint', 'Check for common code problems.', ['jshint']);
	grunt.registerTask('style', 'Check for style conformity.', ['jscs']);
	grunt.registerTask('default', ['setupEnvironment', 'clean', 'lint', 'style', 'test']);
};
