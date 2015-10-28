'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ReviewsSchema = new Schema({
  comment: {type: String, require: true}
});


module.exports = mongoose.model('Reviews', ReviewsSchema);
