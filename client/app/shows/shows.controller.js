angular.module('telebumApp')
  .controller('ShowsCtrl', function($scope, Auth, User, $http, $cookieStore, $q, showService) {
    var user = Auth.getCurrentUser();

    async.series([
      getShows,
      checkHtml
    ], function (err, results) {
      var showRequest = results[0]
      initialPercentage($scope);
    });
    // function getUser(asyncCallback) {
    //   User.get().$promise.then( function(user) {
    //     asyncCallback(null, user);
    //   });
    // }
    function getShows(asyncCallback) {
      showService.getAllShows(function (serviceError, showRequest) {
        $scope.shows = showRequest.shows;
        $scope.user = showRequest.user;
        console.log(showRequest)

        if (!showRequest.user) console.log('no shows yet!')
        asyncCallback(null, showRequest);
      });
    }
    function checkHtml(asyncCallback) {
      angular.element(document).ready(function () {
        setTimeout(function () {
          asyncCallback(null)
        }, 50)
      })
    }
    $scope.setShowId = function (seriesId, added) {
      Auth.currentShow.seriesid = seriesId;
      Auth.currentShow.added = added;
    }


    $scope.advance = function (id) {
      var show = getShowById($scope.shows, id);
      var userInfo = getShowById($scope.user, id);

      var episodeNum = userInfo.current.episode;
      var seasonNum = userInfo.current.season;
      var numPerSeason = show.seasons[seasonNum].length;
      var totalEpisodes = show.numberEpisodes;
      totalSeasons = 0;
      for (var i in show.seasons) {
        totalSeasons ++;
      }
      var seenEpisodes = getNumWatched(userInfo);

      userInfo.seasons[seasonNum - 1].episodes[episodeNum - 1] = true;

      if (seasonNum == totalSeasons && episodeNum >= numPerSeason) {
        // do nothing for now
        // return;
      }
      else {
        // need to deal with arbitrary seen episodes
        if (episodeNum >= numPerSeason) {
          seasonNum ++;
          episodeNum = 1;
        }
        else {
          episodeNum ++;
        }
        seenEpisodes ++;
        userInfo.current.episode = episodeNum;
        userInfo.current.season = seasonNum;
        updateEpisode(showService, id, seasonNum, episodeNum);
      }
      changePercentage(userInfo, show, id)
    }
  });

function changePercentage(userInfo, show, seriesId) {
  var seenEpisodes = getNumWatched(userInfo);

  var percent = parseInt(seenEpisodes)/parseInt(show.numberEpisodes)*100;
  // percent = Math.round(percent);

  var showModel = document.getElementById(seriesId);
  var bar = showModel.childNodes[1].childNodes[1];
  bar.style.width=percent + "%";

}

function initialPercentage($scope) {
  var userInfo = $scope.user;
  var shows = $scope.shows
// setTimeout(function () {
  userInfo.forEach(function (userShow, i) {
    var seriesId = userShow.showId;
    var showModel = document.getElementById(seriesId);
    var bar = showModel.childNodes[1].childNodes[1];
    var showDB = getShowById(shows, seriesId)
    // var Usershow = getShowById(shows, seriesId);
    changePercentage(userShow, showDB, seriesId)
  })
}

function getShowById(shows, id) {
  var showById = null;
  shows.forEach(function (show, i) {
    if (show.showId === id || show._id === id) {
      showById = show;
    }
  });
  if (!showById) console.log('err! should have a show id')
  return showById;
}

function getNumWatched(userInfo) {
  var seenEpisodes = 0;
  userInfo.seasons.forEach(function (season) {
    season.episodes.forEach(function (episode) {
      if (episode) seenEpisodes ++;
    });
  });
  return seenEpisodes;
}

function updateEpisode(showService, showId, seasonNum, episodeNum) {
  showService.watchEpisode(showId, seasonNum, episodeNum, function (serviceError) {

  })
  //make an api call to update this in mongo
}
