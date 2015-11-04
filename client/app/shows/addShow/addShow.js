angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('addShow', {
      url: '/addShow',
      templateUrl: 'app/shows/addShow/addShow.html'
    });
  })
