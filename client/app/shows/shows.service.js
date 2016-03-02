angular.module('telebumApp')
  .service('showService', function($http) {

    var getAllShows = function(callback)
    {
      // var data = {userId:Auth.getCurrentUser()._id};
      // $http.get('/api/users/showInfo/' + showId, data).success(function(data, error){
      $http.get('/api/users/allShows').success(function(data, error){
        if (error && error != 200) console.log(error);
        callback(error, data);
      });
    }

    var watchEpisode = function(showId, seasonNum, episodeNum, callback) {
      var data = {season: seasonNum, episode: episodeNum};
      $http.put('/api/users/watchEpisode/' + showId, data).success(function(data, error) {
        if (error && error != 200) console.log(error);
        callback(error, data)
      });
    }

    var unwatchEpisode = function(showId, seasonNum, episodeNum, callback) {
      var data = {season: seasonNum, episode: episodeNum};
      $http.put('/api/users/unwatchEpisode/' + showId, data).success(function(data, error) {
        if (error && error != 200) console.log(error);
        callback(error, data)
      });
    }

    return {
      getAllShows: getAllShows,
      watchEpisode: watchEpisode,
      unwatchEpisode: unwatchEpisode

    };
  });
