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
gulp.task('default', gulp.series('serve'))
