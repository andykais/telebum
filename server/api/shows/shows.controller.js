'use strict';

var Show = require('./shows.model');
var api = require('../../config/apiKey');
var apiKey = api.tvdb;
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');

// Parses xml to javascript object notation
var parser = xml2js.Parser({
  explicitArray: false,
  normalizeTags: true
});

// Retrieves the Series ID from the series Name from TVDB's api
var getSeriesId = function(seriesName, callback){
  return function(callback){
    console.log(seriesName);
    request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (error, response, body) {
      if (error) return next(error);
      parser.parseString(body, function (err, result) {
        if (!result.data.series) {
          return res.send(400, { message: req.body.showName + ' was not found.' });
        }
        var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
        console.log("seriesId");
        console.log(seriesId);
        callback(err, seriesId);
      });
    });
  }
}

// Retrieves the Series information with the series ID from TVDB's api
var getSeriesInfo = function(seriesId, callback){
    request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function (error, response, body) {
      if (error) return next(error);
      parser.parseString(body, function (err, result) {
        var series = result.data.series;
        var episodes = result.data.episode;
        var show = new Show({
          _id: series.id,
          name: series.seriesname,
          airsDayOfWeek: series.airs_dayofweek,
          airsTime: series.airs_time,
          firstAired: series.firstaired,
          genre: series.genre.split('|').filter(Boolean),
          network: series.network,
          overview: series.overview,
          rating: series.rating,
          ratingCount: series.ratingcount,
          runtime: series.runtime,
          status: series.status,
          poster: series.poster,
          episodes: []
        });
        _.each(episodes, function (episode) {
          show.episodes.push({
            season: episode.seasonnumber,
            episodeNumber: episode.episodenumber,
            episodeName: episode.episodename,
            firstAired: episode.firstaired,
            overview: episode.overview
          });
        });
        callback(err, show);
      });
    });

}


// Retrieves the Series banner "picture" with the show information from TVDB's api
var getSeriesBanner = function(show, callback){
    var url = 'http://thetvdb.com/banners/' + show.poster;
    request({ url: url, encoding: null }, function (error, response, body) {
      show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
      callback(error, show);
    });
}

// Adds a show to the database !
exports.addShow = function(req, res, next) {
  var seriesName = req.body.showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

  async.waterfall([
    getSeriesId(seriesName),
    getSeriesInfo,
    getSeriesBanner
  ], function (err, show) {
    if (err) return next(err);
    show.save(function (err) {
      if (err) {
        if (err.code == 11000) {
          return res.send(409, { message: show.name + ' already exists.' });
        }
        return next(err);
      }
      res.send(200);
    });
  });
};




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
