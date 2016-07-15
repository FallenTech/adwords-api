var
    cache = require('gulp-cached'),
    debug = require('debug')(__filename),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    eslint = require('gulp-eslint'),
    map = require('map-stream'),
    path = require('path');

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
  'lint project using all linters',
  ['lint:eslint'],
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
      .pipe(eslint.format())
      .pipe(eslint.failAfterError());
  },
  {
    options: {}
  }
);
