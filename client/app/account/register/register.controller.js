angular.module('telebumApp')
  .controller('RegisterCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.create = function() {
      $scope.submitted = true;
      console.log($scope.user.email)
      Auth.createUser({
        username: $scope.user.username,
        password: $scope.user.password
      })
      .then( function() {
        // Account created, redirect to home
        $location.path('/');
      })
      .catch( function(err) {
        err = err.data;
        $scope.errors = {};

        // Update validity of form fields that match the mongoose errors
        // angular.forEach(err.errors, function(error, field) {
        //   form[field].$setValidity('mongoose', false);
        //   $scope.errors[field] = error.message;
        // });
      });
    };

  });
