'use strict';

var globalShowScope;
var globalShowService
angular.module('telebumApp')
  .controller('ShowsCtrl', function($scope, Auth, User, $http, $cookieStore, $q, showService) {
    // var user = Auth.getCurrentUser();

    async.series([
      getShows,
      checkHtml
    ], function (err, results) {
      var showRequest = results[0]
      initialPercentage($scope);
      globalShowScope = $scope;
      globalShowService = showService;
    });
    function getShows(asyncCallback) {
      showService.getAllShows(function (serviceError, showRequest) {
        $scope.shows = showRequest.shows;
        $scope.user = showRequest.user;
        $scope.finished = false;
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
    $scope.getWidth = function (seriesId) {
      return 100/getShowById($scope.shows, seriesId).numberEpisodes
    }
    $scope.numEpisodes = function (seriesId) {
      return getShowById($scope.shows, seriesId).numberEpisodes;
    }
    $scope.advance = function (id) {
      var show = getShowById($scope.shows, id);
      var userInfo = getShowById($scope.user, id);
      // console.log(userInfo)

      var episodeNum = userInfo.current.episode || 0;
      var seasonNum = userInfo.current.season || 0;
      var numPerSeason = show.seasons[seasonNum].length;
      var totalEpisodes = show.numberEpisodes;
      var episodeName = show.seasons[seasonNum][episodeNum].episodeName;
      totalSeasons = 0;
      for (var i in show.seasons) {
        totalSeasons ++;
      }
      // console.log(Object.getOwnPropertyNames({}).length)
      if (areAllWatched(userInfo)) {
         // do nothing for now
         // return;
      } else {
        userInfo.seasons[seasonNum].episodes[episodeNum] = true;
        if (areAllWatched(userInfo)) userInfo.finished = true;

        updateEpisode(showService, id, seasonNum, episodeNum);

        var msg = "<div class=\"inner\">" +
                  "<span>Watched: " + episodeName + "</span>" +
                  "<span class=\"watchButton\" onclick=unWatchEpisode(" + id + "," + seasonNum + "," + episodeNum + ")>Undo</span>" +
                  "</div>";

        alertify
          .logPosition("bottom center added")
          .delay(3000)
          .maxLogItems(1)
          .closeLogOnClick(true)
          .log(msg, function (clicked) {
            // this will be fixed on next release
            // console.log(clicked)
          });
        // changePercentage(userInfo.current, id)
        userInfo.current = getLastUnWatchedEpisode(userInfo);
      }
    };
  });

function changePercentageOld(userInfo, show, seriesId) {
  var seenEpisodes = getNumWatched(userInfo);
  var percent = parseInt(seenEpisodes)/parseInt(show.numberEpisodes)*100;
  // percent = Math.round(percent);

  var showModel = document.getElementById(seriesId);
  var bar = showModel.childNodes[1].childNodes[1];
  bar.style.width=percent + '%';
}

function initialPercentage($scope) {
  var user = $scope.user;
  var shows = $scope.shows;
// setTimeout(function () {
  user.forEach(function (userShow) {
    var seriesId = userShow.showId;
    var showModel = document.getElementById(seriesId);
    // var bar = showModel.childNodes[1].childNodes[1];
    var showDB = getShowById(shows, seriesId);
    // initialize the current show
    userShow.current = getLastUnWatchedEpisode(userShow);
    userShow.finished = areAllWatched(userShow);
    $scope.$apply();

    // changePercentage(userShow.current, seriesId, seriesId)
  })
}

function getShowById(shows, id) {
  var showById = null;
  shows.forEach(function (show) {
    if (show.showId === id || show._id === id) {
      showById = show;
    }
  });
  if (!showById) {console.log('err! should have a show id')}
  return showById;
}

function getNumWatched(userInfo) {
  var seenEpisodes = 0;
  userInfo.seasons.forEach(function (season) {
    season.episodes.forEach(function (episode) {
      if (episode) {seenEpisodes ++;}
    });
  });
  return seenEpisodes;
}

function updateEpisode(showService, showId, seasonNum, episodeNum) {
  showService.watchEpisode(showId, seasonNum, episodeNum, function (serviceError) {
    if (serviceError) {console.log(serviceError);}
  });
  //make an api call to update this in mongo
}
function unWatchEpisode(seriesId, seasonNum, episodeNum) {
  var userShow = getShowById(globalShowScope.user, seriesId);
  userShow.seasons[seasonNum].episodes[episodeNum] = false;
  userShow.current = {season: seasonNum, episode: episodeNum}
  globalShowScope.$apply();
  globalShowService.unwatchEpisode(seriesId, seasonNum, episodeNum, function (serviceError) {
    if (serviceError) {console.log(serviceError);}
  });
}

function getLastUnWatchedEpisode(userInfo) {
  // console.log('getLast')
  //get the furthest along episode that has been watched
  var current = {
    season: 0,
    episode: 0
  };
  var lastSeason,
    lastEpisode;
  userInfo.seasons.forEach(function (season, sIndex, seasons) {
    season.episodes.forEach(function (episode, eIndex, episodes) {
      if (episode) {
        // console.log(sIndex, eIndex)
        current = getNextEpisode(userInfo, sIndex, eIndex);
      }
      lastEpisode = eIndex;
    });
    lastSeason = sIndex;
  });
  if (current.season === lastSeason && current.episode === lastEpisode && userInfo.seasons[lastSeason].episodes[lastEpisode]) {
    return getFirstUnWatchedEpisode(userInfo);
  }
  // console.log('---got last episode---')
  return current;
}

function getFirstUnWatchedEpisode(userInfo) {
  //get the fist episode that has been unwached
  var current = {},
    noneWatched = true;
  userInfo.seasons.forEach(function (season, sIndex, seasons) {
    season.episodes.forEach(function (episode, eIndex, episodes) {
      if (!episode && noneWatched) {
        noneWatched = false;
        current = {
          season: sIndex,
          episode: eIndex
        }
      }
    });
  });
  if (!noneWatched) return current;
  return {season: userInfo.seasons.length - 1, episode: userInfo.seasons[userInfo.seasons.length - 1].episodes.length -1};
}
function areAllWatched(userInfo) {
  var unwatched = false;
  userInfo.seasons.forEach(function (season, sIndex, seasons) {
    season.episodes.forEach(function (episode, eIndex, episodes) {
      if (!episode) unwatched = true;
    });
  });
  return !unwatched;
}
function getNextEpisode(userInfo, sIndex, eIndex) {
  var current = {
    season: 0,
    episode: 0
  }
  var seasons = userInfo.seasons;
  var episodes = seasons[sIndex].episodes;

  if (sIndex == seasons.length - 1 && eIndex == episodes.length - 1) {
    current.season = sIndex;
    current.episode = eIndex;
  } else if (eIndex == episodes.length - 1) {
    current.season = sIndex + 1;
    current.episode = 0;
  } else {
    // console.log('episisis')
    current.season = sIndex;
    current.episode = eIndex + 1;
  }
  return current;
}
