/**
 * Provides route for the message portion of this application.
 */
var catatpultCallback = require('./../controllers/catapult_callback.js');
var config            = require('./../config');
var express           = require('express');
var router            = module.exports = express.Router();

router.route('*')
	.post(catatpultCallback.event);