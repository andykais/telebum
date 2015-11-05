angular.module('telebumApp')
  .controller('MainCtrl', function ($scope, Auth) {
    $scope.isLoggedIn = function () {
      console.log(Auth.isLoggedIn())
      return !Auth.isLoggedIn();
    }
  });
