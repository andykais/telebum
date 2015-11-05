angular.module('telebumApp')
  .controller('MainCtrl', function ($scope, Auth) {
    $scope.isLoggedIn = function () {
      return !Auth.isLoggedIn();
    }
  });
