angular.module('telebumApp')
  .controller('showInfo', function($scope, $http, $stateParams, Auth, $state) {

    var user = Auth.getCurrentUser();
    $scope.indetermChecks = [];
    $scope.show = {};
    $scope.getshow = function() {
      $http.get('api/users/' + user._id + '/'+ $stateParams.seriesId).success(function(showRequest){
        $scope.show = showRequest.show;
        $scope.user = showRequest.user;
        console.log(showRequest)
        initializeChecks($scope.indetermChecks, $scope.show.seasons);
      });
    }
    $scope.getshow();

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
        $scope.indetermChecks[seasonNum].checked = true;
      } else if (numWatched == 0) {
        $scope.indetermChecks[seasonNum].checked = false;
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
      indetermChecks[sNum] = {
        checked: false,
        indeterminate: false
      };
      seasonsData[sNum].forEach(function(episode, eNum) {
        episode.watched = false;
      });
    }
  }
}
