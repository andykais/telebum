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

exports.getUserInfo = function(req, res, next){
	var userID = String(req.params.id);
	User.findById(id, function(err, userInfo){
		if(err) return res.json({sucess: "False"});
		res.json({sucess: "True"});
		res.json(userInfo);
	});
};


exports.login = function(req, res, next){
	// var userID = String(req.params.id);
  res.json({sucess: "True"});
	// User.findById(id, function(err, userInfo){
	// 	if(err) return res.json({sucess: "False"});
	// 	res.json({sucess: "True"});
	// 	res.json(userInfo);
	// });

};
