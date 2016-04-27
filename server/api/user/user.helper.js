var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var tvdb = require('../tvdb');
var Show = require('../shows/shows.model');
var clientErrors = require('../../components/errors');
var async = require('async');
var chalk = require('chalk');


exports.marker = function(print, color) {
  var message = print || 'Notice Me!!!';
  var messageColor = color || 'bgCyan';
  console.log(chalk[messageColor](message));
}
// exports.MongooseFindById = function(showId, callback) {
exports.getShowById = function(showId, callback) {

  tvdb.addShowId(showId, function (mongoErr, showData) {
    callback(mongoErr, showData);
  });
}
exports.getShowByName = function(name, callback) {
  tvdb.addShow(name, function (mongoErr, showData) {
    callback(mongoErr, showData);
  });
}
exports.getUserById = function(userId, callback) {
  User.findById(userId, function (err, grabbedUser) {
    callback(err, grabbedUser)
  });
}
exports.getUserByName = function(name, callback) {
  User.findAll(function (err, cb) {
    // need to test
  })
}
exports.saveUserField = function(user, field, callback) {
  user.update(field, function (saveErr) {
    callback(saveErr);
  });
}
exports.getUserShowById = function (userId, showId, callback) {
  module.exports.getUserById(userId, function (getUserErr, grabbedUser) {
    if (getUserErr) callback(getUserErr, grabbedUser)
    else {
      // if (grabbedUser.get)
      // console.log(Object.keys(existsAlready))

      var existsAlready;
      // grabbedUser.show.s
      grabbedUser.shows.forEach(function (iterShow) {
        if (Number(iterShow.showId) === Number(showId)) {
          existsAlready = iterShow;
        }
      });
      // if (!existsAlready) module.exports.marker('didnt find a match :()', 'red');
      callback(null, existsAlready)
    }
  });
}
// checks if the show exists in the users db yet
exports.checkUserHasShow = function (userId, showId, asyncCallback) {
  exports.getUserShowById(userId, showId, function (userErr, grabbedUser, grabbedShow) {
    if (userErr) asyncCallback(userErr);
    else {
      if (grabbedShow) asyncCallback(200, 'already added');
      else asyncCallback(null, grabbedUser);
    }
  })
}
// querys and changes any object value at the episode level
exports.updateEpisodeValue = function(userQuery, key, value, controllerCallback) {
  var userId = userQuery.userId,
    showId = userQuery.showId,
    seasonNum = userQuery.seasonNum,
    episodeNum = userQuery.episodeNum;

  async.waterfall([
    async.apply(exports.getUserShowById, userId, showId),
    function (userShow, cb) {
      userShow.seasons[seasonNum].episodes[episodeNum][key] = value;
      console.log(userShow.seasons[seasonNum].episodes[episodeNum])
      var updateQuery = {
          '_id': userId,
          'shows.showId': showId
        },
        updateValues = {
          '$set': {'shows.$': userShow}
        }
      User.findOneAndUpdate(updateQuery, updateValues, cb)
    }
  ], controllerCallback);
}
// gets the show from thetvdb.org
exports.findShowById = function(showId, asyncCallback) {
  tvdb.addShowId(showId, function (err, show) {
    asyncCallback(err, show);
  });
}
//parses stuff into usable user data
var countEpisodes = function(show) {

  var numEpisodes = 0;
  var seasons = [];

  for(var index in show.seasons){
    var seasonData = show.seasons[index];
    var episodes = [];
    for (var episodeIndex in seasonData) {
      episodes.push(false);
    }
    var seasonInput = {
      number: index+1,
      episodes: episodes
    }
  }
}
exports.countEpisodes = function(show) {

  var numEpisodes = 0;
  var seasons = [];

  for(var index in show.seasons){
    var seasonData = show.seasons[index];
    var episodes = [];
    for (var episodeIndex in seasonData) {
      episodes.push({watched:false});
    }
    var seasonInput = {
      number: index+1,
      episodes: episodes
    }
    // var season = show.seasons[index];
    // numEpisodes+=season.length;
    seasons.push(seasonInput);
  }
  // Add it to the user's dataset
  var userShowAddition = {
    showId: show._id,
    title: show.name,
    seasons: seasons,
  };
  return userShowAddition
}
