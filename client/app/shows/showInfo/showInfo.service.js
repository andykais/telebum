angular.module('telebumApp')
  .service('showInfoService', function($http) {

    var getShowInfo = function(showId, data, callback)
    {
      // $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(showRequest){
      $http.get('/api/users/showInfo/' + showId, data).success(function(error, data){
        console.log(data);
        callback(error, data);
      });
    }

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

    return {
      getShowInfo: getShowInfo,
      addNewShow: addNewShow

    };
  });
