angular.module("telebumApp")
  .controller('cookies', function($scope, Auth, $cookies) {
    $scope.saveCookies() = function{
        if(!Auth.isLoggedIn())
          return false;
        else{
          var user = Auth.getCurrentUser;
          var savedDate = new Date();
          $cookies.put('Login', user, savedDate)
        }
    }
  });
