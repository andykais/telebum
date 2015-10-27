angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('main', {
      url: '/other',
      templateUrl: 'app/main/main.html',
      controller: 'MainCtrl'
    });
  })
