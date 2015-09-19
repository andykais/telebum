'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: {type: String, require: true},
  email: { type: String, lowercase: true }
});


module.exports = mongoose.model('User', UserSchema);
