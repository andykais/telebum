var gulp = require('gulp'),
    conf = require('./conf'),
    del = require('del'),
    lazypipe = require('lazypipe'),
    _ = require('lodash'),
    $ = require('gulp-load-plugins')()
// until gulp 4 has a method of sharing references
require('./inject')

exports.styles = lazypipe()
  .pipe($.sourcemaps.init)
  .pipe($.sass)
  .pipe($.autoprefixer, {browsers: ['last 1 version']})
  .pipe($.sourcemaps.write, '.')

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));
gulp.task('clean:dist', () => del(['dist/**/*'], {dot: true}));
gulp.task('clean', gulp.parallel('clean:tmp', 'clean:dist'))


gulp.task('styles', function() {
  return gulp.src(conf.paths.client.mainStyle)
  .pipe(exports.styles())
  .pipe(gulp.dest(`.tmp/app`));
});
gulp.task('build:client', function () {

  var options = { restore:true };
  var appFilter = $.filter('**/app.js', options);
  var jsFilter = $.filter('**/*.js', options);
  var cssFilter = $.filter('**/*.css', options);
  var htmlBlock = $.filter(['**/*.!(html)'], options);

  return gulp.src(conf.paths.client.mainView)
      .pipe($.useref())
          .pipe(appFilter)
              .pipe($.concat('app/app.js'))
          .pipe(appFilter.restore)
          .pipe(jsFilter)
              .pipe($.ngAnnotate())
              .pipe($.uglify())
          .pipe(jsFilter.restore)
          .pipe(cssFilter)
              .pipe($.cleanCss({
                processImportFrom: ['!fonts.googleapis.com']
              }))
          .pipe(cssFilter.restore)
          .pipe(htmlBlock)
              .pipe($.rev())
          .pipe(htmlBlock.restore)
      .pipe(gulp.dest(`${conf.paths.dist}/${conf.clientPath}`));

})
gulp.task('styles:dist', function () {
  return gulp.src(conf.paths.client.mainStyle)
    .pipe(exports.styles())
    .pipe(gulp.dest(`dist/app`));
});
gulp.task('scripts:client', function() {
  return gulp.src(conf.paths.client.scripts)
  .pipe($.sourcemaps.init())
  .pipe($.concat('app.js')) // maybe remove for non dist version
  .pipe($.uglify())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest(`${conf.paths.dist}/client`))
});
gulp.task('scripts:server', function () {
  return gulp.src(_.union(conf.paths.server.scripts, conf.paths.server.json))
    .pipe(gulp.dest(`${conf.paths.dist}/${conf.server}`));
});
gulp.task('scripts', gulp.series('scripts:client', 'scripts:server'))
gulp.task('copy', function () {
  return gulp.src([
    'package.json',
    'bower.json',
    '.bowerrc'
], {cwdbase: true})
    .pipe(gulp.dest(conf.paths.dist));
});

gulp.task(
  'build:dist',
  gulp.series(
    'clean',
    'build:client'
  )
)
gulp.task(
  'build',
  gulp.series(
    'clean',
    'inject',
    'styles',
    'scripts'
  )
)
