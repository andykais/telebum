'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();


// router.get('/:id', controller.getUserInfo);
// router.put('/createUser',  controller.createUser);
// router.post('/login',  controller.login);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id/allShows', auth.isAuthenticated(), controller.allShows)
router.get('/:id/:showId', auth.isAuthenticated(), controller.show)

router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/', controller.create);

// router.delete('/:id', auth.hasRole('admi-n'), controller.destroy);
module.exports = router;
