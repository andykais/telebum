'use strict';

var User = require('./user.model');

/**
 * Creates a user
 */
exports.createUser = function(req, res, next) {
  User.findOne({username: req.body.username } , function (err, user) {
    console.log("here")
    console.log(user)
    console.log(!user)
    if(err){
      return res.json({ success: "flase"});
    }
    else if(!user){
      var newUser = new User(req.body);
      newUser.save(function(err, user) {
        if (err) return res.json({ success: "False" });
        return res.json({ success: "True", id:user._id});
      });
    }
    else{
      console.log(user.id);
      return res.json({ success: "Already made", id:user._id});
    }
  });
};

exports.getUserInfo = function(req, res, next){
	var userID = String(req.params.id);
	User.findOne({_id: req.body.id }, function(err, user){
		if(err) return res.json({sucess: "False"});
		res.json({ success: "True", id:user._id});
	});
};

exports.login = function(req, res, next){
  var userID = String(req.params.id);
  console.log(req.body.id);
	User.find({_id: req.body.id }, function(err, user){
		if(err) return res.json({sucess: "False"});
    else if(user.length == 0) return res.json({sucess: "False"});
		return res.json({ success: "True", id:user._id});
	});
};
