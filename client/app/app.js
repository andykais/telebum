angular.module('telebumApp', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise('/')
    $locationProvider.html5Mode(true);

    // $mdThemingProvider
    //   .theme('green')
    //   .primaryPalette('green', {
    //     'default': '600', // by default use shade 900 from the grey palette for primary intentions
    //   })
    //   $mdThemingProvider.setDefaultTheme('green');
  })
