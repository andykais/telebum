angular.module('telebumApp')
  .controller('RegisterCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    $scope.create = function() {
      $scope.submitted = true;
      Auth.createUser({
        username: $scope.user.username,
        password: $scope.user.password
      })
      .then( function() {
        // Account created, redirect to shows
        $location.path('/shows');
      })
      .catch( function(err) {
        err = err.data;
        $scope.errors = err;
      });
    };

  });
