angular.module('telebumApp')
  .controller('LoginCtrl', function ($scope, $http) {
    $scope.login = function() {
      var username = $scope.username;
      var password = $scope.password;
      $http.post("/api/user/login", {username: username, password: password})
        .success(function (response) {
          console.log(response)
        })
    }
    $scope.register = function () {
      var username = $scope.username;
      var password = $scope.password;
      $http.put("/api/user/createUser", {username: username, password: password})
        .success(function (response) {
          console.log(response)
        })
    }
    // }
  });
