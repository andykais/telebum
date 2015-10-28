'use strict';

var express = require('express');
var controller = require('./shows.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/createShow',  controller.createShow);


module.exports = router;
