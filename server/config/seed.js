/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var mongoose = require('mongoose');
/* Connect to the DB */
mongoose.connect('mongodb://localhost/telebum',function(){
    /* Drop the DB */
    mongoose.connection.db.dropDatabase();
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    username: 'andrew',
    email: 'andrew@andrew.com',
    password: 'andrew',
    //temporary data until joey gets the main api call working
    shows: {
      183122: {
        title: "Adventure Time",
        released: [22,22,28,30,20,43],
        season:[
          {number: 1,
            episode: [
              true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true
            ]
          },
          {number: 2,
            episode: [
              true,true,true,true,true,true,true,true,true,true,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 3,
            episode: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 4,
            episode: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 5,
            episode: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          },
          {number: 6,
            episode: [
              false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false
            ]
          }
        ],
        totalEpisodes: 165,
        on: {
          season: 2,
          episode: 21
        },
        seen: {
          episodes: 44
        }
      },
      652123: {
        title: "House of Cards",
        released: [15,20],
        totalEpisodes: 35,
        on: {
          season: 1,
          episode: 14
        },
        seen: {
          episodes: 14
        }
      }
    }
  }, {
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
