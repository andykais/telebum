angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('shows', {
      url: '/shows',
      templateUrl: 'app/shows/shows.html',
      controller: 'ShowsCtrl'
    })
    .state('addShow', {
      url: '/addShow',
      templateUrl: 'app/shows/addShow/addShow.html',
      controller: 'addCtrl'
    })
    .state('showInfo', {
      url: '/shows/:showId',
      templateUrl: 'app/shows/showInfo/showInfo.html',
      controller: 'showInfo'
    });
  })
