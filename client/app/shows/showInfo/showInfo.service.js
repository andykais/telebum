angular.module('telebumApp')
  .service('showInfoService', function($http) {

    var getShowInfo = function(showId, data, callback)
    {
      // var data = {userId:Auth.getCurrentUser()._id};
      $http.get('/api/users/showInfo/' + showId, data).success(function(data, error){
        if (error && error != 200) console.log(error);
        callback(error, data);
      });
    }

    var getUserShowInfo = function(showId, data, callback)
    {
      $http.get('/api/users/userShowInfo/' + showId, data).success(function(data, error){
        if (error && error != 200) console.log(error);
        callback(error, data);
      });
    }

    var addNewShow = function(showId, data, callback)
    {
      $http.post('/api/users/addShow/' + showId, data).success(function(data, error){
        if (error && error != 200) console.log(error);
        console.log(data);
        callback(error, data);
      });
    }

    var removeExistingShow = function(showId, data, callback)
    {
      $http.delete('/api/users/removeShow/' + showId, data).success(function(data, error){
        if (error && error != 200) console.log(error);
        console.log(data);
        callback(error, data);
      });
    }

    var updateWatched = function(showId, data, callback)
    {
      $http.put('/api/users/watched/' + showId, data).success(function(data, error) {
        console.log(data);
        callback(error, data);
      })
    }

    return {
      getShowInfo: getShowInfo,
      getUserShowInfo: getUserShowInfo,
      addNewShow: addNewShow,
      removeExistingShow: removeExistingShow,
      updateWatched: updateWatched

    };
  });
