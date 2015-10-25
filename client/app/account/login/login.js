angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('login', {
      url: '/',
      templateUrl: 'app/account/login/login.html',
      controller: 'LoginCtrl'
    });
  })
