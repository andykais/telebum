angular.module('telebumApp', ['ui.router', 'ngMaterial'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')
    $locationProvider.html5Mode(true);
  })
