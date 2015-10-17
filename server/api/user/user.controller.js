'use strict';

var User = require('./user.model');

/**
 * Creates a user
 */
exports.createUser = function(req, res, next) {
  var newUser = new User(req.body);

  newUser.save(function(err, user) {
    if (err) return res.json({ success: "False" });
    res.json({ success: "True" });
  });
};
