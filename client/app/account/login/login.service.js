angular.module('telebumApp')
  .factory('LoginService', function ($http, $q) {
    console.log("sindei here")

    function loginCall (userInfo) {
      return $http.post("/api/user/login", userInfo)
    }

    function registerCall (userInfo) {
      return $http.put("/api/user/createUser", userInfo)
    }

    return {
      loginCall:loginCall,
      registerCall: registerCall
    }

  });
  console.log("sindei here")
