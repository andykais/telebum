var gulp = require('gulp'),
    conf = require('./conf'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')

    require('./watch'),
    require('./inject'),
    require('./build')




gulp.task('start:server', function () {
  process.env.NODE_ENV = 'development';
  config = require(`../${conf.serverPath}/config/environment`);
  return nodemon({
    script: `${conf.serverPath}`,
    watch: `${conf.paths.server.scripts}`
  });
});

gulp.task('start:server:prod', function () {
  process.env.NODE_ENV = 'production';
  config = require(`../${conf.paths.dist}/${conf.serverPath}/config/environment`);
  return nodemon({
    script: `${conf.paths.dist}/${conf.serverPath}`,
    watch: `${conf.paths.dist}/${conf.paths.server.scripts}`
  });
});

gulp.task('serve', gulp.parallel(
  'wiredep:client',
  'inject',
  'styles',
  'watch',
  'start:server'
));
gulp.task('serve:dist', gulp.series(
  'build',
  'start:server:prod'
))
