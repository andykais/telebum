/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var mongoose = require('mongoose');
var tvdb = require('../api/tvdb');

/* Connect to the DB */
mongoose.connect('mongodb://localhost/telebum',function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});


tvdb.addShow("rick and morty", function (tvdbError) {
  if (tvdbError) {
    // todo handle tvdb error
  }
});
tvdb.addShow("adventure time", function (tvdbError) {
  if (tvdbError) {
    // todo handle tvdb error
  }
});
tvdb.addShow("house of cards", function (tvdbError) {
  if (tvdbError) {
    // todo handle tvdb error
  }
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'andrew',
    email: 'andrew@andrew.com',
    password: 'andrew',
    //temporary data until joey gets the main api call working
    shows: [{
        showId:152831,
        title: "Adventure Time",
        // released: [22,22,28,30,20,43],
        seasons:[
          {number: 1,
            episodes: [
              true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
            ]
          },
          {number: 2,
            episodes: [
              true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 3,
            episodes: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 4,
            episodes: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 5,
            episodes: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 6,
            episodes: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          }
        ],
        totalEpisodes: 165,
        current: {
          season: 2,
          episode: 21
        },
        seen: {
          episodes: 44
        }
      },
      {
        showId: 79861,
        title: "House of Cards",
        released: [15,20],
        totalEpisodes: 50,
        current: {
          season: 1,
          episode: 14
        },
        seen: {
          episodes: 14
        }
      }
    ]
  }
  , {
    provider: 'local',
    role: 'admin',
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});
