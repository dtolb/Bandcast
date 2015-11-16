'use strict';
var _ = require('lodash');

module.exports = function (grunt) {
	var coverage = 100;
	var lessFiles = './lib/assets/less/**/*.less';
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
				files: lessFiles,
				tasks: [ 'less:default' ]
			}
		},

		less: {
			default: {
				files: {
					'./static/css/style.css': './lib/assets/less/style.less'
				}
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

	// Rename tasks
	grunt.task.renameTask('mocha_istanbul', 'mochaIstanbul');

	// Register tasks
	grunt.registerTask('assets', [ 'less:default' ]);
	grunt.registerTask('test', [ 'mochaIstanbul:coverage' ]);
	grunt.registerTask('lint', 'Check for common code problems.', ['jshint']);
	grunt.registerTask('style', 'Check for style conformity.', ['jscs']);
	grunt.registerTask('default', ['setupEnvironment', 'clean', 'lint', 'style', 'test']);
};
