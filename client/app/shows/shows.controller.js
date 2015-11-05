angular.module('telebumApp')
  .controller('ShowsCtrl', function($scope, Auth, User, $http, $cookieStore, $q) {

    async.waterfall([
      getUser,
      getShows,
      checkHtml
    ], function (err, results) {
      initialPercentage($scope.shows);
    });

    function getUser(asyncCallback) {
      User.get().$promise.then( function(user) {
        asyncCallback(null, user);
      });
    }
    function getShows(user, asyncCallback) {
      $http.get('/api/users/' + user._id + '/allShows').success(function(shows){
        $scope.shows = shows;
        if (!shows) console.log('no shows yet!')
        asyncCallback(null)
      });
    }
    function checkHtml(asyncCallback) {
      angular.element(document).ready(function () {
        setTimeout(function () {
          asyncCallback(null)
        }, 50)
      })
    }

    $scope.advance = function (id) {
      var show = $scope.shows[id];
      var episodeNum = show.on.episode;
      var seasonNum = show.on.season;
      var numPerSeason = show.released[seasonNum - 1];
      var totalEpisodes = show.totalEpisodes;
      var totalSeasons = show.released.length;
      var seenEpisodes = show.seen.episodes;

      if (seasonNum == totalSeasons && episodeNum >= numPerSeason) {
        // do nothing for now
      } else if (episodeNum >= numPerSeason) {
        episodeNum = 1;
        seasonNum ++;
        seenEpisodes ++;
      } else {
        episodeNum ++;
        seenEpisodes ++;
      }
      show.on.episode = episodeNum;
      show.on.season = seasonNum;
      show.seen.episodes = seenEpisodes;
      changePercentage(show, id)
      // show.released[seasonNum] = numPerSeason;
    }
  });

function changePercentage(show, seriesId) {
  var percent = parseInt(show.seen.episodes)/parseInt(show.totalEpisodes)*100;
  percent = Math.round(percent);

  var showModel = document.getElementById(seriesId);
  var bar = showModel.childNodes[1].childNodes[1];
  bar.style.width=percent + "%";

}

function initialPercentage(shows) {
// setTimeout(function () {
  for (var seriesId in shows) {
    var showModel = document.getElementById(seriesId);
    var bar = showModel.childNodes[1].childNodes[1];
    var show = shows[seriesId];
    changePercentage(show, seriesId)
  }
// }, 100)
}
