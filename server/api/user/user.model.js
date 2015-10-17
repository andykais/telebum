'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Show = require('../shows/shows.model');

var UserSchema = new Schema({
  name: {type: String, require: true},
  email: {type: String, lowercase: true },
  shows: [{
  	show: {type: Show},
  	previousEpisodeS: {type: int},
  	previousEpisodeN: {type: int},
  	episodesWatched: {type: int},
  	favorites: [{
  		episodeS: {type: [int]},
  		episodeN: {type: [int]}
  	}]
  }]
});


module.exports = mongoose.model('User', UserSchema);
