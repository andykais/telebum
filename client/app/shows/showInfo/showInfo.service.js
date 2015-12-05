angular.module('telebumApp')
  .service('showInfoService', function($http) {

    var addNewShow = function(showId, data, callback)
    {
      $http.post('/api/users/addShow/' + showId, data).success(function(error, data){
        console.log(data);
        callback(error);
      });
    }

    var removeExistingShow = function(showId, data, callback)
    {
      $http.delete('/api/users/removeShow/' + showId, data).success(function(error, data){
        console.log(data);
        callback(error);
      });
    }

    return{
        addNewShow: addNewShow
    };
  });
