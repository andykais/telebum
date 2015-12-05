'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var tvdb = require('../tvdb');
var Show = require('../shows/shows.model');

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

  User.findById(userId, function (err, user) {
    if (err) return next(err);
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
  var showId = req.params.id;
  var showinfo;
  var userId = req.body.userId;
  console.log(userId);
  User.findById(userId, function (err, user) {
    if(err) {
      res.status(500).send(err);
    } else {
      user.shows.forEach( function(val, key){
        console.log(val.title);
        if(val.title == req.showName){
          return res.status(200).send('already added');
        }
      })

      Show.findById(showId, function (err, show) {
        console.log(show);
        if(show != undefined) {
          showinfo = show;
          console.log(5);
          console.log(showinfo);
        } else {
          tvdb.addShow(req.body.showName, function(tvdbError, showInfo) {
            if (tvdbError) {
              // todo handle tvdb error
            }
          // console.log(showinfo)
          });
        }
      });

      var numEpisodes = 0;
      var seasons = [];
      console.log(showinfo);
      for(season in showinfo.seasons){
        numEpisodes+=seasons.length;
        seasons.append(seasons.length);
      }
      // Add it to the user's dataset
      console.log(5);
      userShow = {
        showId: showinfo._id,
        title: showinfo.name,
        seen : {episodes : 0 },
        on : {
          episode : 1,
          season : 1
        },
        totalEpisodes : numEpisodes,
        released: seasons
      };
      user.shows.append(userShow);
      res.json(userShow);
    }
  });
};

/**
 * remove show from user's list
 */
exports.removeShow = function(req, res, next) {
  var userId = req.user._id,
      show = req.body.showId;
  User.findById(userId, function (err, user) {
    if(err) {
      res.status(500).send(err);
    } else {
      delete user.shows[showId];
      user.save(function(err) {
        if (err) return res.status(500).send(err);
        res.status(200).send('OK');
      });
    }
  });
};

/**
 * Displays all shows in the user's list
 */
exports.allShows = function(req, res, next) {
  var userId = req.params.id;
  User.findById(userId, function (err, user) {
    if(err) {
      return res.status(200).send('Error');
    }
    res.json(user.shows);
  });
};

/**
 * Adds one show to user's list
 */
exports.show = function(req, res, next) {
  var userId = req.params.id,
      showId = req.params.showId;
  User.findById(userId, function (err, user) {
    if(err) {
      res.status(500).send(err);
    } else {
      var show = user.shows[showId];
      Show.findById(showId, function (err, showInfo) {
        if(err){
          return res.json({show: show, showInfo: err})
        }
        if(showInfo) {
          return res.json({user: show, show: showInfo});
        }
        else{
          tvdb.addShowId(showId, function (err, firstPullShowInfo) {
            return res.json({show: firstPullShowInfo});
          });
        }
      });
    }
  });
};
