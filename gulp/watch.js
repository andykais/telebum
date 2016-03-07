var gulp = require('gulp'),
    conf = require('./conf'),
    lr = require('tiny-lr')(),
    $ = require('gulp-load-plugins')(),
    styles = require('./build').styles
    lintServerScripts = require('./test').lintServerScripts


var path = require('path')
require('./inject')

function notifyLivereload(event) {
  if (event) {
    console.log("reloading browser for file " + path.basename(event.path));
    lr.changed({
      body: {
        files: [event.path]
      }
    });
  } else {
    console.log('did it')
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
  $.watch(conf.paths.client.styles, notifyLivereload)
    gulp.src(conf.paths.client.mainStyle)
      .pipe($.plumber())
      .pipe(styles())
      .pipe(gulp.dest('.tmp/app'))

  $.watch(conf.paths.client.views, notifyLivereload)
    .pipe($.plumber())

  $.watch(conf.paths.client.scripts, notifyLivereload) //['inject:js']
    .pipe($.plumber())
    .pipe(gulp.dest('.tmp/app'))

  // should server restart reload browser? research
  $.watch(conf.paths.server.scripts, function () {
    // require('nodemon')
    // nodemon.emit('restart');
  })
      .pipe($.plumber())
      .pipe(lintServerScripts())

  $.watch('bower.json', function(event) {
    gulp.task('wiredep:client')
    notifyLivereload(event)
  });

  // watch server pages and reload the browser after nodemon executes
  // $.watch(['server/**/*.js'], function (event) {
  //   setTimeout(function () {
  //     notifyLivereload(event)
  //   }, 1000) // waits until the server restarts to execute
  // });
});

// the nodemon task
gulp.task('nodemon',function() {
	nodemon({
		script:'server/server.js',
		ext:'js',
    watch: 'server'
	})
  .on('start', function () {

  })
	.on('restart',function() {
		console.log("restarted");
    // notifyLivereload()
	})
});
