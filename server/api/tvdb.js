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
var getSeriesId = function(showName, asyncCallback) {
  var seriesName = showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

  request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (requestError, response, body) {
    if (requestError) {
      asyncCallback(requestError)
    }
    parser.parseString(body, function (parseError, result) {
      if (parseError) {
        asyncCallback(parseError)
      }
      else {
        var seriesId = result.data.series.seriesid || result.data.series[0].seriesid;
        asyncCallback(null, seriesId);
      }
    });
  });
}

var searchSeriesId = function(seriesName){
  return function(asyncCallback){
    request.get('http://thetvdb.com/api/GetSeries.php?seriesname=' + seriesName, function (requestError, response, body) {
      if (requestError) {
        asyncCallback(requestError);
      } else {
        parser.parseString(body, function (err, result) {
          if (!result.data.series) {
            asyncCallback(seriesName + ' was not found.');
          }
          else {
            var series;
            if(result.data.series.length){
              series = result.data.series.slice(0, 10);
            }
            else{
              series = [result.data.series];
            }
            async.map(series, getAllData, function (err, results) {
              asyncCallback(err, series);
            })
          }
        });
      }
    });
  }
}

// Retrieves the Series information with the series ID from TVDB's api
var getSeriesInfo = function(seriesId, callback){
  request.get('http://thetvdb.com/api/' + apiKey + '/series/' + seriesId + '/all/en.xml', function (requestError, response, body) {
    if (requestError) {
      callback(requestError);
    }
    else {
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
          numberEpisodes: 0,
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
        callback(null, show);
      });
    }
  });
}


// Retrieves the Series banner "picture" with the show information from TVDB's api
var getSeriesBanner = function(show, callback) {
  var url = 'http://thetvdb.com/banners/' + show.poster;
  request({ url: url, encoding: null }, function (error, response, body) {
    show.poster = 'data:' + response.headers['content-type'] + ';base64,' + body.toString('base64');
    callback(error, show);
  });
}

function getAllData(series, asyncCallback) {
  request.get('http://thetvdb.com/api/' + apiKey + '/series/' + series.seriesid + '/all/en.xml', function (error, response, body) {
    parser.parseString(body, function (err, result) {
      var series = result.data.series;
      var episodes = result.data.episode;
      var show = {
        _id: series.id,
        name: series.seriesname,
        year: series.firstaired,
        genre: series.genre.split('|').filter(Boolean),
        network: series.network,
        overview: series.overview,
        status: series.status,
        poster: series.poster
      }
      asyncCallback(null, show)
    });

  })
}

// Adds a show to the database !
exports.addShowId = function(showId, callback) {
  async.waterfall([
    function (asyncCallback) {
      asyncCallback(null, showId)
    },
    getSeriesInfo,
    getSeriesBanner
  ], function (getErr, show) {
    if (getErr) callback(getErr);
    else {

      for(var season in show.seasons){
        show.numberEpisodes += show.seasons[season].length;
      }
      console.log(show.name, '-', show.numberEpisodes);
      show.save(function (saveErr) {
        if (!saveErr || saveErr.code == 11000) {
          //duplicate entries are not errors
          callback(null, show)
        }
        else {
          callback(saveErr)
        }
      });
    }

  });
}

// Adds a show to the database !
exports.addShow = function(showName, callback) {
  var addShowById = module.exports.addShowId;
  async.waterfall([
    function (asyncCallback) {
      asyncCallback(null, showName)
    },
    getSeriesId,
    addShowById
  ], callback);
}


// Searches for a show to be added !
exports.searchShows = function(showName, cb){
  var seriesName = showName
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(/[^\w-]+/g, '');

    // Return name, year, and numer of season
    async.waterfall([
      searchSeriesId(seriesName)
    ], function (err, shows) {
      if (err) return cb(err);
      cb(shows);
    });
}
