angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.show;
    console.log("here");
    $scope.getshow = function() {
      console.log($stateParams.showId)
      $http.get('api/users/' + user._id + '/'+ $stateParams.showId).success(function(show){
        $scope.show = show;
        console.log($scope.show)
        if (!show) console.log('No show returned')
      });
    }
    
    $scope.getshow();
  });
