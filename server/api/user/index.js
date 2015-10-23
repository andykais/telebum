'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');

var router = express.Router();


router.get('/:id', controller.getUserInfo);
router.put('/createUser',  controller.createUser);
router.post('/login',  controller.login);


module.exports = router;
