var gulp        = require('gulp'),
    path        = require('path'),
    wiredep = require('wiredep').stream,
    $ = require('gulp-load-plugins')(),
    _ = require('lodash'),
    conf = require('./conf')


// helper functions
function sortModulesFirst(a, b) {
    var module = /\.module\.js$/;
    var aMod = module.test(a.path);
    var bMod = module.test(b.path);
    // inject *.module.js first
    if (aMod === bMod) {
        // either both modules or both non-modules, so just sort normally
        if (a.path < b.path) {
            return -1;
        }
        if (a.path > b.path) {
            return 1;
        }
        return 0;
    } else {
        return (aMod ? -1 : 1);
    }
}

// inject bower components
gulp.task('wiredep:client', () => {

  return gulp.src(conf.paths.client.mainView)
    .pipe(wiredep(conf.wiredep))
    .pipe(gulp.dest(`${conf.clientPath}/`));
});

gulp.task('inject:js', function () {
  return gulp.src(conf.paths.client.mainView)
    .pipe($.inject(
      gulp.src(_.union(conf.paths.client.scripts, [`!${conf.clientPath}/app/app.js`]), {read: false})
      .pipe($.sort(sortModulesFirst)),
      {
        starttag: '<!-- injector:js -->',
        endtag: '<!-- endinjector -->',
        transform: (filepath) => '<script src="' + filepath.replace(`/${conf.clientPath}/`, '') + '"></script>'
      }))
      .pipe(gulp.dest(conf.clientPath));
});
gulp.task('inject:scss', function () {
  return gulp.src(conf.paths.client.mainStyle)
    .pipe($.inject(
      gulp.src(_.union(conf.paths.client.styles, ['!' + conf.paths.client.mainStyle]), {read: false})
        .pipe($.sort()),
      {
        starttag: '// injector',
        endtag: '// endinjector',
        transform: (filepath) => {
          var newPath = filepath
            .replace(`/${conf.clientPath}/app/`, '')
            .replace(`/${conf.clientPath}/components/`, '../components/')
            .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
            .replace('.scss', '');
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${conf.clientPath}/app`));
});
gulp.task('inject', gulp.parallel('inject:js', 'inject:scss', 'wiredep:client'))
