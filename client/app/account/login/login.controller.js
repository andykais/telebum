angular.module('telebumApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function() {
      Auth.login({
        email: $scope.user.username,
        password: $scope.user.password
      })
      .then( function() {
        // Logged in, redirect to home
        $location.path('/');
      })
      .catch( function(err) {
        $scope.errors.other = err.message;
      });
    };

  });
