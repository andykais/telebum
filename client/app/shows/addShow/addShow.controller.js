'use strict';

angular.module('telebumApp')
  .controller('addCtrl', function($scope, $http, Auth, $state) {

    $scope.searchValue = '';

    $scope.search = function() {
      $scope.shows;
      console.log('searching...')

      $http.get('api/shows/search/'+ $scope.searchValue).success(function(shows){
        $scope.shows = shows;
        console.log($scope.shows)
        // if (!shows) console.log('no shows yet!')
      });
    }
    $scope.setShowId = function (seriesId, added) {
      Auth.currentShow.seriesId;
      Auth.currentShow.added;
    }
    // var source = $('#search')
  	// 	.asEventStream('input')
  	// 	.debounce(400)
  	// 	.subscribe(function (event) {
  	// 		var query = $('#search').val();
  	// 		if (query == '') {restore();}
  	// 		else {
  	// 			if ($('#search-type').val() == 'cwe') {
  	// 				findCwe(response, query);
  	// 			} else {
  	// 				find(response, query);
  	// 			}
  	// 		}
  	// 	});
  });
