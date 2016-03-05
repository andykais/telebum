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
    lazypipe = require('lazypipe')
    del = require('del'),
    _ = require('lodash'),
    wiredep = require('wiredep').stream

const clientPath  = 'client';
const serverPath  = 'server';
var serverConfig = require(`./${serverPath}/config/environment`);

const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    scripts: [
      `${clientPath}/**/*.js`,
      `!${clientPath}/bower_components/**/*`
    ],
    styles: [`${clientPath}/app/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/{app,components}/**/*.html`,
    mainView: `${clientPath}/index.html`,
    bower: `${clientPath}/bower_components/`,
  },
  server: {
    scripts: [`${serverPath}/**/*.js`],
    json: [`${serverPath}/**/*.json`],
  },
  dist: 'dist'
}

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


// reusable pipelines
var lintClientScripts = lazypipe()
  .pipe(plugins.jshint, `${clientPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

var lintServerScripts = lazypipe()
  .pipe(plugins.jshint, `${serverPath}/.jshintrc`)
  .pipe(plugins.jshint.reporter, 'jshint-stylish');

var transpileClient = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
      optional: ['es7.classProperties']
  })
  .pipe(plugins.sourcemaps.write, '.')

var transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
      optional: ['runtime']
  })
  .pipe(plugins.sourcemaps.write, '.')

var styles = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.sass)
  .pipe(plugins.autoprefixer, {browsers: ['last 1 version']})
  .pipe(plugins.sourcemaps.write, '.');

var minifyScripts = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.sourcemaps.write, '.')
  // .pipe(plugins.concat, 'app.js') // maybe remove for non dist version
  // .pipe(plugins.uglify)

gulp.task('clean:tmp', () => del(['.tmp/**/*'], {dot: true}));
gulp.task('clean:dist', () => del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], {dot: true}));


gulp.task('inject:js', function () {
  return gulp.src(paths.client.mainView)
    .pipe(plugins.inject(
      gulp.src(_.union(paths.client.scripts, [`!${clientPath}/app/app.js`]), {read: false})
      .pipe(plugins.sort(sortModulesFirst)),
      {
        starttag: '<!-- injector:js -->',
        endtag: '<!-- endinjector -->',
        transform: (filepath) => '<script src="' + filepath.replace(`/${clientPath}/`, '') + '"></script>'
      }))
      .pipe(gulp.dest(clientPath));
});
gulp.task('inject:scss', function () {
  return gulp.src(paths.client.mainStyle)
    .pipe(plugins.inject(
      gulp.src(_.union(paths.client.styles, ['!' + paths.client.mainStyle]), {read: false})
        .pipe(plugins.sort()),
      {
        starttag: '// injector',
        endtag: '// endinjector',
        transform: (filepath) => {
          var newPath = filepath
            .replace(`/${clientPath}/app/`, '')
            .replace(`/${clientPath}/components/`, '../components/')
            .replace(/_(.*).scss/, (match, p1, offset, string) => p1)
            .replace('.scss', '');
          return `@import '${newPath}';`;
        }
      }))
    .pipe(gulp.dest(`${clientPath}/app`));
});
gulp.task('inject', gulp.parallel('inject:js', 'inject:scss'))

// inject bower components
gulp.task('wiredep:client', () => {
    return gulp.src(paths.client.mainView)
        .pipe(wiredep({
            exclude: [
                /bootstrap-sass-official/,
                /bootstrap.js/,
                /json3/,
                /es5-shim/,
                /bootstrap.css/,
                /font-awesome.css/
            ],
            ignorePath: clientPath
        }))
        .pipe(gulp.dest(`${clientPath}/`));
});



gulp.task('styles', function() {
  return gulp.src(paths.client.mainStyle)
    .pipe(styles())
    .pipe(gulp.dest(`.tmp/app`));
});
gulp.task('javascript', function() {
  return gulp.src(paths.client.scripts)
  .pipe(minifyScripts())
  .pipe(gulp.dest(`.tmp/app`))
});
gulp.task('copy', function () {
  return gulp.src([
    'package.json',
    'bower.json',
    '.bowerrc'
], {cwdbase: true})
    .pipe(gulp.dest(paths.dist));
})
gulp.task('view', function () {
  // do stuff like useref inject
});

gulp.task('lint:client', function () {
  return gulp.src(paths.client.scripts)
    .pipe(lintClientScripts());
});
gulp.task('lint:server', function () {
  return gulp.src(paths.server.scripts)
    .pipe(lintClientScripts());
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
gulp.task(
  'build',
  gulp.series(
    'clean:tmp',
    'clean:dist',
    'inject',
    'styles',
    'javascript'
  )
)
