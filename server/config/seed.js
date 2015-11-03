/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');

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
        released: {
          1: 22,
          2: 22,
          3: 28,
          4: 30,
          5: 20,
          6: 43,
          total: 165
        },
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
        released: {
          1: 15,
          2: 20,
          total: 35
        },
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
