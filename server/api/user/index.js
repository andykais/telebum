'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');

var router = express.Router();

router.put('/createUser',  controller.createUser);
router.get('/:id', controller.getUserInfo);


module.exports = router;
