angular.module('telebumApp')
  .controller('RegisterCtrl', function ($scope, $http) {
    $scope.register = function () {
      var username = $scope.username;
      var password = $scope.password;
      $http.put("/api/user/createUser", {username: username, password: password})
        .success(function (response) {
          console.log(response)
        })
    }
  });
