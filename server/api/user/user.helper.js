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
      console.log(grabbedUser.shows.length)
      grabbedUser.shows.forEach(function (iterShow) {
        console.log(iterShow.showId, showId)
        if (Number(iterShow.showId) === Number(showId)) {
          existsAlready = iterShow;
          module.exports.marker('found a match!', 'blue')
          // console.log(Object.keys(existsAlready))
        }
      });
      if (!existsAlready) module.exports.marker('didnt find a match :()', 'red');
      // console.log(Object.keys(existsAlready))
      callback(null, existsAlready)
      // var existsAlready = grabbedUser.get('shows').filter(function (iterShow) {
      //   console.log(iterShow.showId, Number(showId))
      //   console.log(Number(iterShow.showId) === Number(showId))
      //   return Number(iterShow.showId) === Number(showId);
      // });
      // if (existsAlready.length == 0) {
      //   module.exports.marker()
      // }
      // callback(null, existsAlready[0]);
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
