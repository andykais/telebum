angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.getshow = function() {
      $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(showRequest){
        $scope.show = showRequest.show;
        $scope.user = showRequest.user;
        console.log(showRequest)
      });
    }
    $scope.getshow();
    var showSeason = {};
    $scope.checkedData = [];
    $scope.toggleChecks = function(checked) {
      console.log(checked)
      $scope.checkedData = [];
    }
    //todo: give checkboxes a third state when episodes are half finished
    $scope.checkSeason = function(seasonNumber) {
        // todo when clicked turn off all episode checkboxes below
    }
    $scope.openEpisodes = function(seasonNumber) {
      showSeason[seasonNumber] = !showSeason[seasonNumber];
    }
    $scope.showEpisodes = function(seasonNumber) {
      return showSeason[seasonNumber]
    }
  });
