'use strict';

angular.module('telebumApp')
  .controller('navbar', function($scope, Auth, $state, $location) {
    $scope.showAddButton = function() {
      if (!Auth.isLoggedIn())
        return false;
      else if ($state.current.name == "addShow")
        return false;
      else
        return true;
    }
    $scope.logout = function () {
      Auth.logout()
      $location.path('/');
    }
  });
