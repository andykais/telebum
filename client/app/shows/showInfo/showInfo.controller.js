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
      console.log($scope.user)
      initializeChecks($scope.indetermChecks, $scope.show.seasons);
    });
    function getUserData(asyncCallback) {
      var data = {userId:user._id};
      showInfoService.getUserShowInfo($stateParams.seriesId, data, function(serviceError, showRequest) {
        $scope.user = showRequest;
        asyncCallback(null);
      });
    }
    function getShow(asyncCallback) {
      var data = {userId:user._id};
      showInfoService.getShowInfo($stateParams.seriesId, data, function(serviceError, showRequest){
        $scope.show = showRequest;
        asyncCallback(null);
      });
    }

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
      // var seasonProbed = $scope.user.season;
      var totalEpisodes = $scope.show.seasons[seasonNum].length;
      var numWatched = 0;
      // console.log(seasonProbed)
      seasonProbed.forEach(function (episode, eNum) {
        // console.log(episode.watched)
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
      var data = {userId:user._id};
      showInfoService.addNewShow(showId, data, function(serviceError){
        getUserData(function(){})
      })
    }
    $scope.removeExistingShow = function(showId){
      var data = {userId:user._id};
      showInfoService.removeExistingShow(showId, data, function(serviceError){
        getUserData(function(){})
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
