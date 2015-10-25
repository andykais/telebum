angular.module('telebumApp')
  .controller('LoginCtrl', function ($scope, $http, LoginService) {
    $scope.login = function() {
      var username = $scope.username;
      var password = $scope.password;
      var user = {username: username, password: password}

      LoginService.loginCall(user)
        .success(function (response) {
          console.log(response)
        })
    }
    $scope.register = function () {
      var username = $scope.username;
      var password = $scope.password;
      var user = {username: username, password: password}

      LoginService.registerCall(user)
        .success(function (response) {
          console.log(response)
        })
    }
    // }
  });
