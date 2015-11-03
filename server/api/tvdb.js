'use strict';

var api = require('../config/apiKey');
var apiKey = api.tvdb;
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var _ = require('lodash');
var Show = require('./shows/shows.model');

// Parses xml to javascript object notation
var parser = xml2js.Parser({
  explicitArray: false,
  normalizeTags: true
});

// Retrieves the Series ID from the series Name from TVDB's api
var getSeriesId = function(seriesName, callback){
  return function(callback){
    request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (error, response, body) {
      if (error) return next(error);
      parser.parseString(body, function (err, result) {
        if (!result.data.series) {
          return res.send(400, { message: req.body.showName + ' was not found.' });
        }
        var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
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
          seasons: {}
        });
        _.each(result.data.episode, function (episode, key) {
          if(episode.seasonnumber > 0){
            if(episode.episodenumber == 1){
              show.seasons[episode.seasonnumber] = [];
            }
            show.seasons[episode.seasonnumber].push({
              season: episode.seasonnumber,
              episodeNumber: episode.episodenumber,
              episodeName: episode.episodename,
              firstAired: episode.firstaired,
              overview: episode.overview
            });
          }
        })
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
exports.addShow = function(showName) {
  var seriesName = showName
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
          return (show.name + ' already exists.');
        }
        return (err);
      }
      return(show._id);
    });
  });
};
