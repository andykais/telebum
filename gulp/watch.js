var gulp = require('gulp'),
    conf = require('./conf'),
    lr = require('tiny-lr')(),
    $ = require('gulp-load-plugins')(),
    styles = require('./build').styles,
    test = require('./test')

var path = require('path')
require('./inject')

function notifyLivereload(event) {
  // gulp.src(event.path, {read: false})
  //   .pipe($.livereload(lr))
  if (event) {
    console.log("reloading browser for file " + path.basename(event.path));
    lr.changed({
      body: {
        files: [event.path]
      }
    });
  } else {
    lr.changed({
      body: {
        files: [path.join('./client/index.html')]
      }
    })
  }
}

gulp.task('watch',function() {
	// watch js files and run lint and run js and angular tasks
	// gulp.watch(	['server/**/*.js'],				['js', 'angular']);
  // port for the brower livereload
  lr.listen(35729);

  // watch client pages and reload the browser
  $.watch(conf.paths.client.styles, function () {
    gulp.src(conf.paths.client.mainStyle)
    .pipe($.plumber())
    .pipe(styles())
    .pipe(gulp.dest('.tmp/app'))
  })

  $.watch(conf.paths.client.views, notifyLivereload)
    .pipe($.plumber())

  $.watch('.tmp/app/app.css', notifyLivereload)

  $.watch(conf.paths.client.scripts, notifyLivereload) //['inject:js']
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/app'))

  // should server restart reload browser? research
  $.watch(conf.paths.server.scripts, function (event) {
    setTimeout(function () {
      notifyLivereload(event)
    }, 1500)
    // $.nodemon.emit('restart');
})
      .pipe($.plumber())
      .pipe(test.lintServerScripts())

  $.watch('bower.json', function(event) {
    gulp.task('wiredep:client')
    notifyLivereload(event)
  });
});
