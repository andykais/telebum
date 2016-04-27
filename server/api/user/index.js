'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();


// router.get('/:id', controller.getUserInfo);
// router.put('/createUser',  controller.createUser);
// router.post('/login',  controller.login);

// it could be `GET /shows` for index, `GET /shows/:id` for get show info, `POST shows/` for add, and `DELETE /shows/:id` for remove

router.get('/', auth.hasRole('admin'), controller.index);
// return a list of user's shows
router.get('/allShows', auth.isAuthenticated(), controller.allShows)
// detailed info for a certain show + user show info
router.get('/showInfo/:showId', auth.isAuthenticated(), controller.show);                    //
// only detailed info for a user info (consider removing above call)
router.get('/userShowInfo/:showId', auth.isAuthenticated(), controller.userShow);                    //
// add a show to a users db
router.post('/addShow/:showId', auth.isAuthenticated(), controller.addShow);
// remove a show
router.delete('/removeShow/:showId', auth.isAuthenticated(), controller.removeShow);
// mark an episode as watched
router.put('/watchEpisode/:showId', auth.isAuthenticated(), controller.watchEpisode);
// unmark episode as watched
router.put('/unwatchEpisode/:showId', auth.isAuthenticated(), controller.unwatchEpisode);
// updates a whole season of watched/unwatched values (for showInfo page)
// (consider using only this instead of watch unwatch)
router.put('/watched/:showId', auth.isAuthenticated(), controller.updateWatched);
// mark an episode as favorite
router.put('/favorite/:showId', auth.isAuthenticated(), controller.favorite)

// authentication calls
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.post('/', controller.create);                                            // Create a user

// router.delete('removeShow/:id', controller.removeShow);

// router.delete('/:id', auth.hasRole('admi-n'), controller.destroy);
module.exports = router;
