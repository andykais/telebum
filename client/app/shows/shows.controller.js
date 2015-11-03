angular.module('telebumApp')
  .controller('ShowsCtrl', function($scope) {
    $scope.shows = showData;

    angular.element(document).ready(function () {
      for (var seriesId in showData) {
        var show = showData[seriesId];
          changePercentage(show, seriesId)
      }
    });

    $scope.advance = function (id) {
      var show = showData[id];
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
      console.log(seenEpisodes)
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

//temporary data until joey gets the main api call working
var showData = {
  "183122": {
    "title": "Adventure Time",
    "released": [22,22,28,30,20,43],
    "totalEpisodes": 165,
    "on": {
      "season": 2,
      "episode": 21
    },
    "seen": {
      "episodes": 44
    }
  },
  "652123": {
    "title": "House of Cards",
    "released": [15,20],
    "totalEpisodes": 35,
    "on": {
      "season": 1,
      "episode": 14
    },
    "seen": {
      "episodes": 14
    }
  }
}
