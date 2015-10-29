'use strict';

var express = require('express');
var controller = require('./reviews.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/createReview',  controller.createReview);


module.exports = router;
