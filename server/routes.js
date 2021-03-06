/**
 * Main application routes
 */

'use strict';

var express = require('express');
var errors = require('./components/errors');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/users', require('./api/user'));
  app.use('/api/reviews', require('./api/reviews'));
  app.use('/api/shows', require('./api/shows'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //  .get(errors[404]);

  //All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html');
    });
};
