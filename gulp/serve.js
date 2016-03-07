var gulp = require('gulp'),
    conf = require('./conf'),
    nodemon = require('gulp-nodemon'),
    $ = require('gulp-load-plugins')




gulp.task('serve:dist', () => {
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    config = require(`${conf.paths.dist}/${conf.serverPath}/config/environment`);
    nodemon({
      scripts: `${conf.paths.dist}/${conf.serverPath}`,
      watch: `${conf.paths.dist}/${conf.serverPath}`
    })
});

gulp.task('serve', () => {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  config = require(`../${conf.serverPath}/config/environment`);
  nodemon({
    script: `${conf.serverPath}`,
    watch: `${conf.paths.server.scripts}`,
  })
});
