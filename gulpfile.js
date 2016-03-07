/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp');

var HubRegistry = require('gulp-hub');
var hub = new HubRegistry(['gulp/*.js']);
// gulp.registry(hub);


/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
// wrench.readdirSyncRecursive('./gulp').filter(function(file) {
//   return (/\.(js|coffee)$/i).test(file);
// }).map(function(file) {
//   require('./gulp/' + file);
// });
/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
// gulp.task('default', ['clean'], function () {
//   gulp.start('build');
// });



// Load all the plugins (Seen in package.json dev-dependencies)
// var minifyCSS   = require('gulp-minify-css');    // minifies css files
// var rename      = require('gulp-rename');          // renames files
// var jshint      = require('gulp-jshint');				   // Checks js files for errors ie. semi colons
// var concat      = require('gulp-concat');				   // Converts multiple files into one file
// var uglify      = require('gulp-uglify');				   // stringifies js files
// var ngAnnotate  = require('gulp-ng-annotate'); 	 // Makes angular files able to be combined into one file
// var bower  = require('gulp-bower'); 	 // run bower install
var gulp        = require('gulp'),
    path        = require('path'),
    nodemon     = require('gulp-nodemon'),				 // Watches for changing files and restarts
    sass        = require('gulp-sass'),
    lr          = require('tiny-lr')(),
    plugins = require('gulp-load-plugins')(),
    lazypipe = require('lazypipe'),
    del = require('del'),
    _ = require('lodash'),
    wiredep = require('wiredep').stream







gulp.task('view', function () {
  // do stuff like useref inject
});


gulp.task('fonts', function () {
  // move font awesome
});


// move font awesome to
gulp.task('icons', function() { 
    return gulp.src('./clent/bower_components/fontawesome/fonts/**.*') 
        .pipe(gulp.dest('./client/fonts')); 
});

// task to minify css files
gulp.task('minification', function () {
  return gulp.src()
})
// task to convert sass to css

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

// port for the brower livereload
gulp.task('tiny', function () {
  lr.listen(35729);
});


// once gulp 4.0 arrives, do tasks in this order:
// [nodemon, tiny]
// [styles, minification]
// watch
// gulp.task('default', ['nodemon', 'tiny', 'styles', 'watch']);		// Just run gulp!
// gulp.task(
//   'default',
//   gulp.series(
//     gulp.parallel('styles'),
//     gulp.parallel('nodemon', 'tiny'),
//     'watch'
//   )
// )
// need to handle errors, make sure nodemon exits
