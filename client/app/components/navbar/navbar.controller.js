angular.module('telebumApp')
  .controller('navbar', function($scope, Auth, $state) {
    $scope.showAddButton = function() {
      if (!Auth.isLoggedIn())
        return false;
      else if ($state.current.name == "addShow")
        return false;
      else
        return true;
    }
  });
