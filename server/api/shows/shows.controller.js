'use strict';

var Show = require('./shows.model');
var api = require('../../config/apiKey');
var tvdb = require('../tvdb');
var apiKey = api.tvdb;
var _ = require('lodash');
var tvdb = require('../tvdb');

// Adds a show to the database !
exports.addShow = function(req, res, next) {
  var response = tvdb.addShow(req.body.showName);
  res.send(response);
};

// Adds a show to the database !
exports.searchShows = function(req, res, next) {
  tvdb.searchShows(req.params.showName, function(shows){
    return res.json(shows);
  });
};

/**

result.data.series
/**
 * Retrieves All shows
 * router.get('/',  controller.getAllShows);
 */
exports.getAllShows = function(req, res, next) {

};

/**
 * Retrieves a show by id
 * router.get('/:id',  controller.getShow);
 */
exports.getShow = function(req, res, next) {

};

/**
 * Updates a show information
 * router.put('/',  controller.updateShow);
 */
exports.updateShow = function(req, res, next) {

};

/**
 * Updates a show information
 * router.put('/:id',  controller.updateShow);
 */
exports.updateAllShows = function(req, res, next) {

};

/**
 * Deletes All Shows
 * router.delete('/',  controller.deleteAllShows);
 */
exports.deleteAllShows = function(req, res, next) {

};

/**
 * Deltes a specified show
 * router.delete('/:id',  controller.deleteShow);
 */
exports.deleteShow = function(req, res, next) {

};
