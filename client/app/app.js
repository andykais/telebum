
angular.module('telebumApp', ['ui.router'])
    .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/')
        $locationProvider.html5Mode(true);
    })
