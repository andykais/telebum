'use strict';

var express = require('express');
var controller = require('./shows.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/search/:showName',  controller.searchShows);
router.get('/',  controller.getAllShows);
router.get('/:id',  controller.getShow);


router.post('/',  controller.addShow);

router.put('/',  controller.updateShow);
router.put('/:id',  controller.updateAllShows);

router.delete('/',  controller.deleteAllShows);
router.delete('/:id',  controller.deleteShow);

module.exports = router;
