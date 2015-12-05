angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state, showInfoService) {

    var user = Auth.getCurrentUser();
    $scope.indetermChecks = [];
    $scope.show = {};
    async.parallel([
      getUserData,
      getShow
    ], function (err, result) {
      if (err) console.log(err)
      console.log($scope.show)
      initializeChecks($scope.indetermChecks, $scope.show.seasons);
    });
    function getUserData(asyncCallback) {
      // todo, send user info for this specific show
      // $http.get('/api/users/' + user._id + '/user/' + $stateParams.seriesId).success(function(shows){
        // $scope.user;
        asyncCallback(null);
      // });
    }
    function getShow(asyncCallback) {
      $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(showRequest){
        $scope.show = showRequest.show;
        $scope.user = showRequest.user;
        asyncCallback(null);
      });
    }
    // getShow();
    // getUserData();

    var showSeason = {};
    $scope.toggleChecks = function(checked, seasonNum) {
      if (checked) {
        setChecks($scope.show.seasons[seasonNum], true);
      } else {
        setChecks($scope.show.seasons[seasonNum], false);
      }
    }
    $scope.isIndeterm = function(seasonNum) {
      var seasonProbed = $scope.show.seasons[seasonNum];
      var totalEpisodes = seasonProbed.length;
      var numWatched = 0;
      seasonProbed.forEach(function (episode, eNum) {
        if (episode.watched) {
          numWatched ++;
        }
      });
      if (numWatched == totalEpisodes) {
        $scope.indetermChecks[seasonNum] = true;
      } else if (numWatched == 0) {
        $scope.indetermChecks[seasonNum] = false;
      } else {
        return true;
      }
      return false;
    }
    $scope.openEpisodes = function(seasonNumber) {
      showSeason[seasonNumber] = !showSeason[seasonNumber];
    }
    $scope.showEpisodes = function(seasonNumber) {
      return showSeason[seasonNumber]
    }
    $scope.addNewShow = function(showId){
      showInfoService.addNewShow(showId, function(callback){
        getShow(function(){})
      })
    }
    $scope.removeExistingShow = function(showId){
      showInfoService.addNewShow(showId, function(callback){
        getShow(function(){})
      })
    }
  });

function setChecks(season, value) {
  season.forEach(function(episode, num) {
    episode.watched = value;
  })
}
function initializeChecks(indetermChecks, seasonsData) {
  //similating db data
  for (var sNum in seasonsData) {
    if (seasonsData.hasOwnProperty(sNum)) {
      // 0: none checked 1: some checked 2: complete
      indetermChecks[sNum] = false;
      seasonsData[sNum].forEach(function(episode, eNum) {
        episode.watched = false;
      });
    }
  }
}
