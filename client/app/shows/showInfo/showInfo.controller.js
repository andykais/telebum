angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.show;
    $scope.getshow = function() {
      console.log(Auth.getShowId())
      console.log('api/users/' + user._id + '/'+ Auth.getShowId().seriesid)
      $http.get('api/users/' + user._id + '/'+ Auth.getShowId().seriesid).success(function(show){
        $scope.show = show;
        console.log(show)
        // console.log($stateParams.showId)
        // if (!show) console.log('No show returned')
      });
    }
    $scope.getshow();
  });
