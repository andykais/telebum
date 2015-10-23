'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Show = require('../shows/shows.model');

var UserSchema = new Schema({
  name: {type: String, require: true},
  email: {type: String, lowercase: true },
  shows: [{
  	show: {type: Schema.Types.ObjectId},
  	previousEpisodeS: {type: Number},
  	previousEpisodeN: {type: Number},
  	episodesWatched: {type: Number},
  	favorites: [{
  		episodeS: {type: [Number]},
  		episodeN: {type: [Number]}
  	}]
  }]
});


module.exports = mongoose.model('User', UserSchema);
