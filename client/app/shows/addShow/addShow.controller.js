angular.module('telebumApp')
  .controller('addCtrl', function($scope, Auth, $state) {

    $scope.searchValue = "";

    $scope.search = function() {
      console.log($scope.searchValue)
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
