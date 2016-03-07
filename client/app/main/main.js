'use strict';

angular.module('telebumApp')
  .config(function ($stateProvider) {
    $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'app/main/main.html'
    });
  });
