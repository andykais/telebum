angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.getshow = function() {
      $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(show){
        $scope.showInfo = show.showInfo;
        $scope.userInfo = show.show;
        console.log(show)
      });
    }
    $scope.getshow();
  });
