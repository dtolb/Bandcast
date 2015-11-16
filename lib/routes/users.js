/**
 * Provides route for the users portion of this application.
 */
var auth    = require('./../controllers/basic_auth');
var express = require('express');
var users   = require('./../controllers/users');
var router  = module.exports = express.Router();

router.route('*')
	.get(auth,
		users.getUsers)
	.delete(auth,
		users.deleteUser)
	.post(auth,
		users.validateUser,
		users.addUser);