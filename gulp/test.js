var gulp = require('gulp'),
    conf = require('./conf'),
    lazypipe = require('lazypipe'),
    $ = require('gulp-load-plugins')();

// reusable pipelines
exports.lintClientScripts = lazypipe()
  .pipe($.jshint, `${conf.clientPath}/.jshintrc`)
  .pipe($.jshint.reporter, 'jshint-stylish');

exports.lintServerScripts = lazypipe()
  .pipe($.jshint, `${conf.serverPath}/.jshintrc`)
  .pipe($.jshint.reporter, 'jshint-stylish');

gulp.task('lint:client', function () {
  return gulp.src(conf.paths.client.scripts)
    .pipe(exports.lintClientScripts());
});
gulp.task('lint:server', function () {
  return gulp.src(conf.paths.server.scripts)
    .pipe(exports.lintClientScripts());
});
