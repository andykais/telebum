/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var UserController = require('../api/user/user.controller');
var mongoose = require('mongoose');
var tvdb = require('../api/tvdb');
var async = require('async')
var helpers = require('../api/user/user.helper');


/* Connect to the DB */
mongoose.connect('mongodb://localhost/telebum',function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'andrew',
    email: 'andrew@andrew.com',
    password: 'andrew',
    //temporary data until joey gets the main api call working
    shows: []
  }
  , {
    provider: 'local',
    role: 'admin',
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      User.find({username: 'andrew'}, function (err, user) {
        (function () {

          var userId = user[0]._id;
          var episodeChanges = [];
          var episodeChanges2 = [];
          for (var i = 0; i < 25; ++i) {
            episodeChanges.push(i);
          }
          for (var i=0; i < 3; ++i) {
            episodeChanges2.push(i)
          }

          async.series([
            function (cb) {
              // add adventure time
              seedAddShow(userId, 152831, function(err) {
                seedWatchSeason(userId, 152831, 1, cb)
              });
            }, function (cb) {
              // add house of cards
              seedAddShow(userId, 262980, function(err) {
                seedWatchSeason(userId, 262980, 1, cb)
              });
            }
          ], function (error, results) {
            console.log('finished populating users');
          });
        })(User);

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
          userShow = results[2][1];

      var length = show.get('seasons')[seasonNum].length;
      var episodeChanges = Array.apply(null, Array(length)).map(function(v) {return true});;
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
    seasons: seasons,
    current : {
      episode : 1,
      season : 1
    },
  };
  return userShowAddition
}
