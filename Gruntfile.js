module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    //Testing
    mochaTest: {
      all: {
        options: {
          reporter: 'nyan',
          clearRequireCache: false
        },
        src: ['test/**/*.js']
      },
      data:{
        options: {
          reporter: 'spec'
        },
        src: ['test/data_test.js']
      }
    },
    //Linting
    jshint: {
      all: ['Gruntfile.js', 'lib/**/*.js', 'test/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        forin:true,
        freeze:true,
        maxdepth:3,
        browser: true,
        unused:true,
        globals: {
          jQuery: true
        },
      }
    }
  });
  grunt.registerTask('default', ['mochaTest', 'jshint']);
};
