/**
 * Provides route for the message portion of this application.
 */

var auth     = require('./../controllers/basic_auth');
var express  = require('express');
var messages = require('../controllers/messages');
var router   = module.exports = express.Router();

router.route('*')
	.get(auth,
		messages.getMessages)
	.post(auth,
		messages.validateMessage,
		messages.validateUser,
		messages.sendMessage);