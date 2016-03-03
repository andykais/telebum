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
      console.log({show: $scope.show, user: $scope.user})
      initializeChecks($scope.indetermChecks, $scope.show.seasons);
      // might be inefficient
      $scope.$watch('user.seasons', function(newValue, oldValue) {
        // console.log(newValue)
        var data = {userSeasons: newValue};
        showInfoService.updateWatched($stateParams.seriesId, data, function(serviceError, status) {

        })
      }, true);
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
        setChecks($scope.user.seasons[seasonNum], true);
      } else {
        setChecks($scope.user.seasons[seasonNum], false);
      }
    }
    $scope.isIndeterm = function(seasonNum) {
      var totalEpisodes = $scope.show.seasons[seasonNum].length;
      var episodesProbed = $scope.user.seasons[seasonNum].episodes;
      var numWatched = 0;

      episodesProbed.forEach(function (episode, eNum) {
        if (episode) numWatched ++;
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
  season.episodes.forEach(function(episode, num, scopedEpisodes) {
    scopedEpisodes[num] = value;
  });
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
