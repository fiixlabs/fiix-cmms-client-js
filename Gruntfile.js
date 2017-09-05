module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Gotz "2" clean the distribution dir
		 */
		clean: {
			dist: {
				src: ["./dist"]
			},
			build: {
				src: ["./build"]
			},
			tmp: {
				src: ["./tmp"]
			}
		},

		copy: {
			js: {
				files: [
					{src: ['src/<%= pkg.name %>.js'], dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'}
				]
			},
			license: {
				files: [
					{src: ['LICENSE.txt'], dest: 'dist/LICENSE.txt'}
				]
			},
			spec: {
				files: [
					{expand: true, src: ['spec/*'], dest: 'tmp/', filter: 'isFile'}
				]
			}
		},

		/**
		 * Replace the "version string" with the one provided by the package.json file.
		 */
		replace: {
			js: {
				src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
				replacements: [{
					from: '2.3.1',
					to: '<%= pkg.version %>'
				}]
			},
			npmjs: {
				src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
				dest: 'index.js',
				replacements: [{
					from: '2.3.1',
					to: '<%= pkg.version %>'
				}]
			}
		},

		/**
		 * Minify the code
		 */
		uglify: {
			js: {
				src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js'
			}
		},

		/**
		 * Run test cases in browser-like (PhantomJS) environment
		 */
		jasmine: {
			dev: {
				src: 'src/<%= pkg.name %>.js',
				options: {
					specs: 'tmp/spec/*-spec.js',
					helpers: ['tmp/spec/*-helper.js']
				}
			},
			dist: {
				src: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
				options: {
					specs: 'tmp/spec/*-spec.js',
					helpers: 'tmp/spec/*-helper.js'
				}
			}
		},

		/**
		 * Run test cases in Node.js environment
		 */
		jasmine_node: {
			//	Run Jasmine tests wif Node
			options: {
				forceExit: true,
				matchall: true,
				extensions: 'js',
				projectRoot: "src/",
				verbose: false
			},
			cmms: ['tmp/spec']
		},

		properties: {
			tests: {
				files: {
					'tmp/spec/env-helper.js': [grunt.option('api-tests-properties-path')]
				}
			}
		}
	});

	//
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-npm');
	grunt.loadNpmTasks('grunt-properties');

	//
	grunt.registerTask('build', ['clean:dist', 'clean:build', 'copy:js', 'copy:license', 'replace', 'uglify:js', 'clean:build']);
	grunt.registerTask('test', ['build', 'clean:tmp', 'copy:spec', 'properties', 'jasmine', 'clean:tmp' ]);
	grunt.registerTask('default', ['test']);
};
