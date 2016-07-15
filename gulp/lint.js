var
  cache = require('gulp-cached'),
  debug = require('debug')(__filename),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  jshint = require('gulp-eslint'),
  map = require('map-stream'),
  path = require('path');

var beeper = function(file, cb) {
  return map(function(file, cb) {
    if (!file.jshint.success) {
      // console.log('JSHINT fail in '+file.path);
      file.jshint.results.forEach(function(err) {
        if (err) { gutil.beep(); }
      });
    }
    cb(null, file);
  });
};

var jsLintFiles = [
  './**/*.js',

  // Don't lint bower components
  '!**/bower_components/**/*',

  // Don't lint node modules
  '!**/node_modules/**/*',

  // Don't lint coverage results
  '!coverage/**/*'
];

gulp.task(
  'lint',
  'lint:eslint',
  function() {
    // Linting...
  },
  {
    options: {}
  }
);

gulp.task(
  'lint:eslint',
  'lint project using eslint',
  function() {
    return gulp.src(jsLintFiles)
      .pipe(cache('eslinting'))
      .pipe(eslint())
      .pipe(jshint.format())
      .pipe(beeper());
  },
  {
    options: {}
  }
);
