//users.js controller
var bandcast   = require('./../broadcast');
var config     = require('./../config');
var db         = require('./../db');
var logger     = require('./../logging').winstonLogger;
var Promise    = require('bluebird');
var sprintf    = require('sprintf-js').sprintf;
var validators = require('./../validators');
var ORGANZIER  = config.organizer_string.toLowerCase();
var ATTENDEE   = config.attendee_sring.toLowerCase();

module.exports.validateUser = function (req, res, next) {
	if (req.body !== 'undefined') {
		if (validators.newUser(req.body))
		{
			req.body.role = req.body.role.toLowerCase();
			next();
		}
		else {
			res.status(400).send('Message body not formatted correctly');
		}
	}
	else {
		res.status(400).send('Message body empty');
	}
};

module.exports.addUser = function (req, res, next) {
	bandcast.addUser(req.body)
		.then(function (user) {
			if (user) {
				if (user.role === ATTENDEE) {
					user.username = 'user' + user.id;
				}
				else {
					user.username = null;
				}
				res.status(201);
				res.send({
					role: user.role,
					tn: user.tn,
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username
				});
			}
			else {
				res.status(400);
				res.send('User exists');
			}
		})
		.catch(function (error) {
			next(error);
		});
};

module.exports.getUsers = function (req, res, next) {
	bandcast.getUsers()
		.then(function (users) {
			res.status(200);
			res.send({
				users: users
			});
		})
		.catch(function (error) {
			next(error);
		});
};

module.exports.validateDelete = function (req, res, next) {
	if (!req.query || !req.query.tn) {
		res.status(400).send('User Not Deleted');
	}
	else {
		if (validators.isE164(req.query.tn)){
			next();
		}
		else {
			res.status(400).send('Number must be in e164 format');
		}
	}
};

module.exports.deleteUser = function (req, res, next) {
	bandcast.removeUser(req.query.tn)
		.then(function (user) {
			res.status(200).send('User deleted');
		})
		.catch(function (error) {
			next(error);
		});
};
