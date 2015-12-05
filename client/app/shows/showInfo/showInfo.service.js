angular.module('telebumApp')
  .service('showInfoService', function($http) {

    var addNewShow = function(showId, callback)
    {
      $http.post('/api/shows/addShow/' + showId).success(function(error){
        callback(error)
      });
    }

    var removeExistingShow = function(showId, callback)
    {
      $http.delet('/api/shows/addShow/' + showId).success(function(error){
        callback(error)
      });
    }

    return{
        addNewShow: addNewShow
    };
  });
