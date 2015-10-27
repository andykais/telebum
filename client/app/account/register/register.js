angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('register', {
      url: '/signup',
      templateUrl: 'app/account/register/register.html'
    });
  })
