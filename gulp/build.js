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
gulp.task('clean:dist', () => del([`${conf.paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));
gulp.task('clean', gulp.parallel('clean:tmp', 'clean:dist'))


gulp.task('styles', function() {
  return gulp.src(conf.paths.client.mainStyle)
  .pipe(exports.styles())
  .pipe(gulp.dest(`.tmp/app`));
});
gulp.task('styles:dist', function () {
  return gulp.src(conf.paths.client.mainStyle)
    .pipe(exports.styles())
    .pipe(gulp.dest(`dist/app`));
});

gulp.task('html', function() {
    return gulp.src(`${conf.clientPath}/{app,components}/**/*.html`)
        .pipe($.angularTemplatecache({
          module: 'telebumApp'
        }))
        .pipe(gulp.dest('.tmp'));
});

gulp.task('build:client', function () {
  // var manifest = gulp.src(`${conf.paths.dist}/${conf.clientPath}/assets/rev-manifest.json`);

  var options = { restore:true };
  var appFilter = $.filter('**/app.js', options);
  var jsFilter = $.filter('**/*.js', options);
  var cssFilter = $.filter('**/*.css', options);
  var htmlBlock = $.filter(['**/*.!(html)'], options);
  // <!-- build:css({.tmp,client}) app/app.css -->

  return gulp.src(conf.paths.client.mainView)
      .pipe($.useref())
      // .pipe($.tap(function (file, t) {console.log(file.path)}))
          .pipe(appFilter)
              .pipe($.addSrc.append('.tmp/templates.js'))
              .pipe($.concat('app/app.js'))
          .pipe(appFilter.restore)
          .pipe(jsFilter)
              .pipe($.ngAnnotate())
              .pipe($.uglify())
          .pipe(jsFilter.restore)
          .pipe(cssFilter)
              .pipe($.cleanCss({
                processImport: false // will not try to resolve fonts.googleapis.com
              }))
          .pipe(cssFilter.restore)
          .pipe(htmlBlock)
              .pipe($.rev())
          .pipe(htmlBlock.restore)
      .pipe($.revReplace())
      .pipe(gulp.dest(`${conf.paths.dist}/${conf.clientPath}`));

})
gulp.task('scripts:client', function() {
  return gulp.src(conf.paths.client.scripts)
  .pipe($.sourcemaps.init())
  .pipe($.sourcemaps.write('.'))
  .pipe(gulp.dest('.tmp/app'))
});
// gulp.task('scripts:dist', gulp.series('scripts:client:dist'))
gulp.task('copy:server', function () {
  return gulp.src(_.union(conf.paths.server.scripts, conf.paths.server.json))
    .pipe(gulp.dest(`${conf.paths.dist}/${conf.serverPath}`));
});
gulp.task('copy:extras', () => {
    return gulp.src([
        `${conf.clientPath}/favicon.ico`,
        `${conf.clientPath}/robots.txt`
    ], { dot: true })
        .pipe(gulp.dest(`${conf.paths.dist}/${conf.clientPath}`));
});
gulp.task('copy:base', function () {
  return gulp.src([
    'package.json',
    'bower.json',
    '.bowerrc'
], {cwdbase: true})
    .pipe(gulp.dest(conf.paths.dist));
});
gulp.task(
  'copy',
  gulp.parallel(
    'copy:base',
    'copy:server',
    'copy:extras'
  )
);

gulp.task(
  'build',
  gulp.series(
    'clean',
    'inject',
    'styles',
    'html',
    'copy',
    'build:client'
  )
)
