'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShowsSchema = new Schema({
  name: {type: String, require: true}
});


module.exports = mongoose.model('Shows', ShowsSchema);
