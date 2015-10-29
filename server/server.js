/**
 * Main application file
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
// var config = require('./config/environment');
var expressConfig = require('./config/express');
var routes = require('./routes');
var app = express();
var server = require('http').createServer(app);
var config = require('./config/environment');

// Connect to database
mongoose.connect('mongodb://localhost/telebum');

// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }

// Setup server
expressConfig(app);
routes(app);
server.listen(8080);
console.log("magic on port 8080");

// Expose app
exports = module.exports = app;
