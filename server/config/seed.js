/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Show = require('../api/shows/shows.model');
var UserController = require('../api/user/user.controller');
var mongoose = require('mongoose');
var tvdb = require('../api/tvdb');
var async = require('async')
var helpers = require('../api/user/user.helper');


/* Remove content of user Collection */
User.remove({}, function (err) {});
/* Remove content of shows Collection */
Show.remove({},function (err) {});

var showSeeds = [
  {
    seriesId: 152831,
    watchSeason: 1,
  },
  {
    seriesId: 262980,
    watchSeason: 1,
  }
]

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'andrew',
    email: 'andrew@andrew.com',
    password: 'andrew',
    //temporary data until joey gets the main api call working
    shows: []
  },
  {
    provider: 'local',
    role: 'admin',
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      User.find({username: 'andrew'}, function (err, user) {
        var userId = user[0]._id;

        async.eachSeries(showSeeds, function (item, eachCb) {
          seedAddShow(userId, item.seriesId, function(err) {
            if (err) console.log(err)
            seedWatchSeason(userId, item.seriesId, item.watchSeason, eachCb)
          });
        }, function (err) {
          console.log('finished populating users');
        });
      });
    }
  );
});

function seedAddShow(userId, showId, callback) {
  async.waterfall([
    async.apply(helpers.getShowById, showId),
    function(foundShow, cb) {
      cb(null, countEpisodes(foundShow));
    },
    function(userShowAddition, cb) {
      helpers.getUserById(userId, function (err, foundUser) {
        var myShows = foundUser.get('shows')
        myShows.push(userShowAddition);
        var field = {shows: myShows}
        cb(null, foundUser, field);
      });
    },
    helpers.saveUserField,
  ], function (waterfallErr, results) {
    callback(waterfallErr)
  });
}
function seedWatchSeason(userId, showId, seasonNum, callback) {

  async.waterfall([
    function (cb) {
      async.parallel([
        async.apply(helpers.getShowById, showId),
        async.apply(helpers.getUserById, userId),
        async.apply(helpers.getUserShowById, userId, showId)
      ], cb)
    },
    function (results, cb) {
      var show = results[0],
          user = results[1],
          userShow = results[2];

      var length = show.get('seasons')[seasonNum].length;
      var episodeChanges = Array.apply(null, Array(length)).map(function(v) {return true});
      episodeChanges.forEach(function (value, episodeNum) {
        userShow.seasons[seasonNum - 1].episodes[episodeNum] = value;
      });
      User.findOneAndUpdate({'_id': userId, 'shows.showId': showId}, {'$set': {'shows.$': userShow}}, function (mongoErr) {
        cb(mongoErr);
      });
    }
  ], function (waterfallErr, results) {
    callback()
  });
}
function countEpisodes(show) {

  var numEpisodes = 0;
  var seasons = [];

  for(var index in show.seasons){
    var seasonData = show.seasons[index];
    var episodes = [];
    for (var episodeIndex in seasonData) {
      episodes.push(false);
    }
    var seasonInput = {
      number: index,
      episodes: episodes
    }
    seasons.push(seasonInput);
  }
  // Add it to the user's dataset
  var userShowAddition = {
    showId: show._id,
    title: show.name,
    seasons: seasons
  };
  return userShowAddition
}
