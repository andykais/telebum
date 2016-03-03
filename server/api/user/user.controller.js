'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var clientErrors = require('../../components/errors');
var jwt = require('jsonwebtoken');
var tvdb = require('../tvdb');
var Show = require('../shows/shows.model');
var async = require('async');
var chalk = require('chalk');
var helpers = require('./user.helper')

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};


/**
 * Get a single user
 */
exports.getUser = function (req, res, next) {
  var userId = req.params.id;
  getUser(userId, function(getUserErr, user) {
    if (getUserErr) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
/**
 * Add shows to user's list
 */
exports.addShow = function(req, res, next) {
  var userId = req.user._id;
  var showId = req.params.showId;

  // gets user and show, makes sure not already added
  async.parallel([
    async.apply(checkUserHasShow, userId, showId),
    async.apply(findShowById, showId)
  ], function (addingErrors, result) {
    if (addingErrors) clientErrors(res, addingErrors, result);
    else {
      var foundUser = result[0];
      var foundShow = result[1];

      var userShowAddition = countEpisodes(foundShow);
      var myShows = foundUser.get('shows');
      myShows.push(userShowAddition);
      foundUser.update({'shows': myShows}, function (err) {
        console.log(err)
      })
      // foundUser.shows.append(userShowAddition);
      res.json(userShowAddition);
    }
  })
};
/**
 * remove show from user's list
 */
exports.removeShow = function(req, res, next) {
  var userId = req.user._id;
  var showId = req.params.showId;

  getUser(userId, function(getUserErr, grabbedUser) {
    if (getUserErr) clientErrors(res, 500, getUserErr);
    else {
      for (var index in grabbedUser.shows) {
        if (grabbedUser.shows[index].showId == Number(showId)) {
          grabbedUser.shows.splice(index, 1);
        }
      }
      grabbedUser.save(function (saveErr) {
        if (saveErr) clientErrors(res, 500, saveErr);
        else res.status(200).send('OK');
      });
    }
  });
};

/**
 * marks a specific episodeof a show as watched (true)
 */
exports.watchEpisode = function(req, res, next) {
  var userId = req.user._id;
  var showId = req.params.showId;
  var seasonNum = req.body.season;
  var episodeNum = req.body.episode;

  async.waterfall([
    async.apply(helpers.getUserShowById, userId, showId),
    function (userShow, cb) {
      userShow.seasons[seasonNum].episodes[episodeNum] = true;
      var updateQuery = {
          '_id': userId,
          'shows.showId': showId
        },
        updateValues = {
          '$set': {'shows.$': userShow}
        }
      User.findOneAndUpdate(updateQuery, updateValues, cb)
    }
  ], function (waterfallErr, results) {
    if (waterfallErr) clientErrors(res, 500, waterfallErr);
    else res.status(200).send('OK');
  });
}
/**
 * marks a specific episode of a show as watched (true)
 */
exports.unwatchEpisode = function(req, res, next) {
  var userId = req.user._id,
    showId = req.params.showId,
    seasonNum = req.body.season,
    episodeNum = req.body.episode;

  async.waterfall([
    async.apply(helpers.getUserShowById, userId, showId),
    function (userShow, cb) {
      userShow.seasons[seasonNum].episodes[episodeNum] = false;
      var updateQuery = {
          '_id': userId,
          'shows.showId': showId
        },
        updateValues = {
          '$set': {'shows.$': userShow}
        }
      User.findOneAndUpdate(updateQuery, updateValues, cb)
    }
  ], function (waterfallErr, results) {
    if (waterfallErr) clientErrors(res, 500, waterfallErr);
    else res.status(200).send('OK');
  });
}
/**
 * Displays all shows in the user's list
 */
exports.allShows = function(req, res, next) {
  var userId = req.user._id;
  getUser(userId, function(getUserErr, user) {
    if (getUserErr) clientErrors(res, 500, getUserErr);
    else {
      var showIds = [];
      user.shows.forEach(function(showData) {
        showIds.push(showData.showId);
      })
      async.map(showIds, MongooseFindById, function(mapErr, foundShows) {
        res.json({user:user.shows, shows:foundShows});
      });
    }
  });
};

var MongooseFindById = function(showId, callback) {
  Show.findById(showId, function (mongoErr, showData) {
    //remove the poster for now for faster loading times
    showData.poster = undefined;
    // console.log(showData.poster)
    callback(mongoErr, showData);
  });
}


exports.userShow = function(req, res, next) {
  var userId = req.user._id;
  var showId = req.params.showId;
  getUserShowById(userId, showId, function(getUserErr, grabbedUser, grabbedShow) {
    if (getUserErr) clientErrors(res, 200, getUserErr);
    else res.json(grabbedShow);
  })
}

/**
 * Adds one show to user's list
 */
exports.show = function(req, res, next) {
  var userId = req.user._id,
      showId = req.params.showId;
  User.findById(userId, function (err, user) {
    if(err) {
      res.status(500).send(err);
    } else {
      // change that other helpers
      var show = user.shows[showId];
      Show.findById(showId, function (err, showInfo) {
        if(err){
          return clientErrors(res, 500, err)
          // return res.json({show: show, showInfo: err})
        }
        if(showInfo) {
          return res.json(showInfo)
          // return res.json({user: show, show: showInfo});
        }
        else{
          tvdb.addShowId(showId, function (err, firstPullShowInfo) {
            return res.json(firstPullShowInfo)
            // return res.json({show: firstPullShowInfo});
          });
        }
      });
    }
  });
};

var getUser = function(userId, callback) {
  User.findById(userId, function (err, grabbedUser) {
    callback(err, grabbedUser)
  });
}
var getUserShowById = function (userId, showId, callback) {
  getUser(userId, function (getUserErr, grabbedUser) {
    if (getUserErr) callback(getUserErr, grabbedUser)
    else {
      var existsAlready = grabbedUser.shows.filter(function (iterShow) {
        return iterShow.showId === Number(showId);
      });
      callback(null, grabbedUser, existsAlready[0]);
    }
  });
}
// checks if the show exists in the users db yet
var checkUserHasShow = function (userId, showId, asyncCallback) {
  getUserShowById(userId, showId, function (userErr, grabbedUser, grabbedShow) {
    if (userErr) asyncCallback(userErr);
    else {
      if (grabbedShow) asyncCallback(200, 'already added');
      else asyncCallback(null, grabbedUser);
    }
  })
}
// gets the show from thetvdb.org
var findShowById = function(showId, asyncCallback) {
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
// helps me notice where code is running
var printMarker = function () {
  console.log(chalk.bgCyan('notice me!'))
}
