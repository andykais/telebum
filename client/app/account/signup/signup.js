angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'app/account/signup/signup.html',
      controller: 'SignupCtrl'
    });
  })
