var _         = require('lodash');
var app       = require('./../app');
var config    = require('./config');
var logger    = require('./logging').winstonLogger;
var Promise   = require('bluebird');
var sequelize = require('./models/index').sequelize;
var sprintf   = require('sprintf-js').sprintf;

var ATTENDEE  = config.attendee_sring;
var ORGANZIER = config.organizer_string;

var User    = app.get('models').User;
var Message = app.get('models').Message;

module.exports.saveMessage = function (message) {
	return Message.create({
			fromNumber: message.fromNumber,
			to: message.to,
			text: message.text
		});
};

module.exports.saveUser = function (user) {
	if (user === null) {
		return Promise.reject('No user object');
	}
	if (typeof user.firstName === 'undefined') {
		user.firstName = null;
	}
	if (typeof user.lastName === 'undefined') {
		user.lastName = null;
	}
	return User.create({
		firstName: user.firstName,
		lastName: user.lastName,
		tn: user.tn,
		role: user.role
	});
};

module.exports.getMessagesSentToRole = function (role) {
	return Message.findAll({
		where: {
			to: role
		}
	});
};

module.exports.getAttendeeFromUsername = function (username) {
	var id = username.replace('user', '');
	return User.findOne({
		where: {
			id: id,
			role: ATTENDEE
		}
	});
};

module.exports.getLastAttendee = function () {
	return Message.max('id', {
		where: {
			to: ORGANZIER
		}
	})
	.then(function (max) {
		return Message.findById(max);
	})
	.then(function (message) {
		return User.findOne({
			where: {
				tn: message.fromNumber
			}
		});
	});

};

module.exports.getMessages = function () {
	var query = 'SELECT' +
		'"Messages"."createdAt" as "createdAt",' +
		'"Messages"."to" as "to",' +
		'"Messages"."from_number" as "fromNumber",' +
		'"Messages"."text" as "text",' +
		'"Users"."id" as "userId"' +
		'from "Messages"' +
		'LEFT JOIN "Users" ON "Messages"."from_number" = "Users"."phone_number"';
	return sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
		.then(function (messages) {
			var messageArray = [];
			messages.forEach(function (message) {
				var username;
				if (message.to === ORGANZIER && message.userId) {
					username = sprintf('user%s', message.userId);
				}
				else {
					username = null;
				}
				messageArray.push({
					from: message.fromNumber,
					to: message.to,
					text: message.text,
					timestamp: message.createdAt,
					username: username
				});
			});
			return messageArray;
		});
};

module.exports.removeUser = function (tn) {
	return User.destroy({
		where: {
			tn: tn
		},
		limit: 1
	});
};

module.exports.getTnsForRole = function (role) {
	return User.findAll({
		where: {
			role: role
		}
	})
	.then(function (users) {
		var tns = [];
		users.forEach(function (user) {
			tns.push(user.tn);
		});
		return tns;
	});
};

module.exports.getUsers = function () {
	return User.findAll()
		.then(function (users) {
			var userArray = [];
			users.forEach(function (user) {
				if (user.role === ATTENDEE) {
					user.username = 'user' + user.id;
				}
				else {
					user.username = null;
				}
				userArray.push({
					firstName: user.firstName,
					lastName: user.lastName,
					username: user.username,
					role: user.role,
					tn: user.tn
				});
			});
			return userArray;
		});
};

module.exports.getUser = function (tn) {
	return User.findOne({
		where: {
			tn: tn
		}
	});
};