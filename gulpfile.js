// Load all the plugins (Seen in package.json dev-dependencies)
// var minifyCSS   = require('gulp-minify-css');    // minifies css files
// var rename      = require('gulp-rename');          // renames files
// var jshint      = require('gulp-jshint');				   // Checks js files for errors ie. semi colons
// var concat      = require('gulp-concat');				   // Converts multiple files into one file
// var uglify      = require('gulp-uglify');				   // stringifies js files
// var ngAnnotate  = require('gulp-ng-annotate'); 	 // Makes angular files able to be combined into one file
// var bower  = require('gulp-bower'); 	 // run bower install
var gulp      = require('gulp'),
  path        = require('path'),
  nodemon     = require('gulp-nodemon'),				 // Watches for changing files and restarts
  sass        = require('gulp-sass'),
  lr          = require('tiny-lr')(),
  spawn = require('child_process').spawn,
  exec = require('child_process').exec,
  node;

// move font awesome to
gulp.task('icons', function() { 
    return gulp.src('./clent/bower_components/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./client/fonts')); 
});

// task to minify css files

// task to convert sass to css
gulp.task('styles', function() {
    return gulp.src('./client/app/app.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./client/assets/css/'));
    // gulp.src('./client/bower_components/Skeleton-Sass/scss/skeleton.scss')
    //     .pipe(sass().on('error', sass.logError))
    //     .pipe(gulp.dest('./client/assets/css/'));

});

// task for linting js files
gulp.task('js', function(){
	// grab all the files
	// return gulp.src([	'server/**/*.js',	'client/**/*.js'])
		// .pipe(jshint())
		// .pipe(jshint.reporter('default'));
});

// task to lint, minify, and concat frontend files
gulp.task('angular', function(){
	// return gulp.src(['public/app/.js', 'public/app/**/*.js'])
	// 	.pipe(ngAnnotate())
	// 	.pipe(concat('all.js'))
	// 	.pipe(uglify())
	// 	.pipe(gulp.dest('public/dist'));
});


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

  // watch client pages and reload the browser
  gulp.watch(['client/**/*.html'], notifyLivereload)
  gulp.watch(['client/**/*.js'], notifyLivereload)
  gulp.watch(['client/assets/css/*.css'], notifyLivereload)
  gulp.watch(['client/assets/images/*.png'], notifyLivereload)
  gulp.watch(['client/assets/images/*.jpg'], notifyLivereload)
  gulp.watch(['client/assets/images/*.gif'], notifyLivereload)
  // watch server pages and reload the browser after nodemon executes
  gulp.watch(['server/**/*.js'], function (event) {
    setTimeout(function () {
      notifyLivereload(event)
    }, 1000) // waits until the server restarts to execute
  });
  // compile the sass to css
  gulp.watch( ['client/app/**/*.scss'], ['styles'])
  gulp.watch(['client/bower_components/alertify.js/src/css/*.css'], ['styles'])

  // watch css files and run css task to minify
  // gulp.watch(	['client/assets/css/*.css'],['css']);

});
// port for the brower livereload
gulp.task('tiny', function () {
  lr.listen(35729);
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

// once gulp 4.0 arrives, do tasks in this order:
// [nodemon, tiny]
// [styles, minification]
// watch
gulp.task('default', ['nodemon', 'tiny', 'styles', 'watch']);		// Just run gulp!


// need to handle errors, make sure nodemon exits
