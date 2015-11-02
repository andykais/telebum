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
    "season": 2,
    "episode": 24,
    "episodesSeen": 34,
    "totalEpisodes": 108
  },
  "652123": {
    "title": "House of Cards",
    "season": 3,
    "episode": 14,
    "episodesSeen": 26,
    "totalEpisodes": 45
  }
}
