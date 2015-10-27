'use strict';

angular.module('telebumApp')
  .controller('SignupCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function() {
      $scope.submitted = true;
      console.log($scope.user.email)
      Auth.createUser({
        email: $scope.user.email,
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
