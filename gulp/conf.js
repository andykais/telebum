/**
 *  The main paths of your project handle these with care
 */
const clientPath  = 'client';
const serverPath  = 'server';
exports.clientPath = clientPath;
exports.serverPath = serverPath;
exports.paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    scripts: [
      `${clientPath}/**/*.js`,
      `!${clientPath}/bower_components/**/*`
    ],
    styles: [`${clientPath}/app/**/*.scss`],
    mainStyle: `${clientPath}/app/app.scss`,
    views: `${clientPath}/app/**/*.html`,
    mainView: `${clientPath}/index.html`,
    bower: `${clientPath}/bower_components/`,
  },
  server: {
    scripts: [`${serverPath}/**/*.js`],
    json: [`${serverPath}/**/*.json`],
  },
  dist: 'dist'
}

var serverConfig = require(`../${serverPath}/config/environment`);

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
exports.wiredep = {
  exclude: [/font-awesome.css/],
  ignorePath: clientPath
};
