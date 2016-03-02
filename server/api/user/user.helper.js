var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var tvdb = require('../tvdb');
var Show = require('../shows/shows.model');
var clientErrors = require('../../components/errors');
var async = require('async');
var chalk = require('chalk');


exports.printMarker = function(print) {
  if (print) console.log(chalk.bgCyan('Notice Me!!!') + print);
  else console.log(chalk.bgCyan('Notice Me!!!'));
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
  })
}
exports.getUserShowById = function (userId, showId, callback) {
  module.exports.getUserById(userId, function (getUserErr, grabbedUser) {
    if (getUserErr) callback(getUserErr, grabbedUser)
    else {
      var existsAlready = grabbedUser.get('shows').filter(function (iterShow) {
        return iterShow.showId === Number(showId);
      });
      callback(null, grabbedUser, existsAlready[0]);
    }
  });
}
// checks if the show exists in the users db yet
exports.checkUserHasShow = function (userId, showId, asyncCallback) {
  getUserShowById(userId, showId, function (userErr, grabbedUser, grabbedShow) {
    if (userErr) asyncCallback(userErr);
    else {
      if (grabbedShow) asyncCallback(200, 'already added');
      else asyncCallback(null, grabbedUser);
    }
  })
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
