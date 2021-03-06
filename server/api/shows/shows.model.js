'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShowSchema = new Schema({
  _id: Number,
  name: String,
  airsDayOfWeek: String,
  airsTime: String,
  firstAired: Date,
  genre: [String],
  network: String,
  overview: String,
  rating: Number,
  ratingCount: Number,
  status: String,
  poster: String,
  numberEpisodes: Number,
  episodes: [{
    season: Number,
    episodeNumber: Number,
    episodeName: String,
    firstAired: Date,
    overview: String
  }],
  seasons: {}
});



module.exports = mongoose.model('Show', ShowSchema);
