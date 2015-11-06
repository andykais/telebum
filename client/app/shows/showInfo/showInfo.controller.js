angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.getshow = function() {
      console.log(Auth.currentShow)
      // console.log('api/users/' + user._id + '/'+ Auth.getShowId().seriesid)
      $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(show){
        $scope.allData = show;
        console.log(show)
        // console.log($stateParams.showId)
        // if (!show) console.log('No show returned')
      });
    }
    $scope.getshow();
  });
