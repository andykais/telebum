'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShowSchema = new Schema({
  name: {type: String, require: true}
});


module.exports = mongoose.model('Show', ShowSchema);
