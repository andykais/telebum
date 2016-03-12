var gulp = require('gulp'),
    conf = require('./conf'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')

    require('./watch'),
    require('./build')


gulp.task('serve', gulp.parallel(
  'styles',
  'watch',
  serve
));
gulp.task('serve:dist', gulp.series(
  'build',
  serveDist
))

function serveDist() {
  process.env.NODE_ENV = 'production';
  config = require(`../${conf.paths.dist}/${conf.serverPath}/config/environment`);
  return nodemon({
    script: `${conf.paths.dist}/${conf.serverPath}`,
    watch: `${conf.paths.dist}/${conf.paths.server.scripts}`
  });
}

function serve() {
  process.env.NODE_ENV = 'development';
  config = require(`../${conf.serverPath}/config/environment`);
  return nodemon({
    script: `${conf.serverPath}`
  });
}
