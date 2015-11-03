angular.module('telebumApp')
  .controller('ShowsCtrl', function($scope) {
    $scope.shows = showData;

    angular.element(document).ready(function () {
      for (var seriesId in showData) {
        var show = showData[seriesId];
        var percent = parseInt(show.episodesSeen)/parseInt(show.totalEpisodes)*100;
        percent = Math.round(percent);

        var showModel = document.getElementById(seriesId);
        var bar = showModel.childNodes[1].childNodes[1];
        bar.style.width=percent + "%";


      }
    })
  });


//temporary data until joey gets the main api call working
var showData = {
  "183122": {
    "title": "Adventure Time",
    "released": {
      "1": 22,
      "2": 22,
      "3": 28,
      "4": 30,
      "5": 20,
      "6": 43,
      "total": 165
    },
    "on" {
      "season": 2,
      "episode": 21
    },
    "seen": {
      "episodes": 44
    }
  },
  "652123": {
    "title": "House of Cards",
    "released": {
      "1": 15,
      "2": 20,
      "total": 35
    },
    "on": {
      "season": 1,
      "episode": 14
    },
    "seen": {
      "episodes": 14
    }
  }
}
