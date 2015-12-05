angular.module('telebumApp', ['ui.router', 'ngCookies', 'ngResource', 'ui.indeterminate'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/')
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|data:image):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob):|data:image|data:text\//);

    // $mdThemingProvider
    //   .theme('green')
    //   .primaryPalette('green', {
    //     'default': '600', // by default use shade 900 from the grey palette for primary intentions
    //   })
    //   $mdThemingProvider.setDefaultTheme('green');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          console.log("redirecting to login");
          event.preventDefault();
          $location.path('/');
        }
        // redirect to shows page if logged in - So, user can't get back to login
        // if ($location.path() == '/' && loggedIn) {
        //     $location.path('/shows');
        // }
      });
    });
  });
