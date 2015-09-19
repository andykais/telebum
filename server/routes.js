/**
 * Main application routes
 */

'use strict';

// var errors = require('./components/errors');
var express = require('express');
// var config = require('./config/environment');

module.exports = function(app) {

  // Insert routes below
  // app.use('/api/users', require('./api/user'));
  //
  // app.use('/uploads', express.static(config.imageUploadPath));

  // app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  // app.route('/:url(api|components|app|bower_components|assets)/*')
  //  .get(errors[404]);
  // console.log(app.get('appPath') + '/index.html');

  //All other routes should redirect to the index.html
  app.route('/')
    .get(function(req, res) {
      // console.log(app.get('appPath') + '/index.html');
      res.sendfile(app.get('appPath') + '/index.html');
      // res.send("hey");

    });
};
