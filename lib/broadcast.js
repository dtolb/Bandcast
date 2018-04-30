var _        = require('lodash');
var catapult = require('./catapult');
var config   = require('./config');
var db       = require('./db');
var logger   = require('./logging').winstonLogger;
var Promise  = require('bluebird');
var sprintf  = require('sprintf-js').sprintf;

var ATTENDEE             = config.attendee_sring;
var ORGANZIER            = config.organizer_string;
var ORGANZIER_SUB_STRING = config.organizer_subscribe_string.toLowerCase();
var REMOVE_STRING        = config.user_stop_string;
var SUBSCRIBE_STRING     = config.attendee_subscribe_string;

function Bandcaster() {

	var self = this;

	var handleAttendeeMessage = function (message) {
		message.to = ORGANZIER;
		return db.saveMessage(message)
			.then(function (message) {
				return db.getTnsForRole(ORGANZIER);
			})
			.then(function (tns) {
				if (tns.length <= 0) {
					return Promise.resolve();
				}
				else {
					return catapult.sendMessage({
						tns: tns,
						text: sprintf('%s is %s', message.fromUsername, message.firstAndLast)
					})
					.then(function (res) {
						logger.debug('Sent name text');
						logger.debug(res);
						return catapult.sendMessage({
							tns: tns,
							text: sprintf('%s: %s', message.fromUsername, message.text)
						});
					});
				}
			});
	};

	var handleOrganizerMessage = function (message) {
		var action = message.text.charAt(0); //Get first character
		if (action === '@') {
			//if there is no user name after '@' it is a quick response
			if (message.text.charAt(1) === ' ') {
				//remove the '@' from the message
				message.text = message.text.substr(1).trim();
				//send message to last attendee
				return quickReplyToAttendee(message);
			}
			else {
				//Extract the user from the message text
				message.user = message.text.split(' ')[0].substr(1);
				//Remove the '@user' from the message text
				message.text = message.text.replace('@' + message.user, '').trim();
				return messageAttendee(message);
			}
		}
		else if (action === '#') {
			logger.debug('Sending message to attendees');
			message.text = message.text.substr(1).trim();
			return messageAttendees(message);
		}
		else if (message.text.toLowerCase().trim() === 'help') {
			var response = 'Start your message with a "#" to Broadcast. ' +
				'Or a "@" to quick reply to ONLY last user. ' +
				'Begin your message with "@<username>" to message ONLY that user';
			return catapult.sendMessage({
				tns: [message.fromNumber],
				text: response
			});
		}
		else {
			return catapult.sendMessage({
				tns: [message.fromNumber],
				text: 'Invalid Broadcast message. Text help for more information'
			});
		}
	};

	var copyOrganizer = function (message) {
		return db.getTnsForRole(ORGANZIER)
			.then(function (tns) {
				var index = tns.indexOf(message.fromNumber);
				if (index > -1) {
					tns.splice(index, 1);
				}
				return catapult.sendMessage({
					tns: tns,
					text: message.text
				});
			});
	};

	var messageAttendee = function (message) {
		return db.getAttendeeFromUsername(message.user)
			.then(function (user) {
				if (user) {
					message.to = user.tn;
					return catapult.sendMessage({
						tns: [user.tn],
						text: message.text
					})
					.then(function () {
						return db.saveMessage(message);
					})
					.then(function () {
						message.text =  sprintf('Org texted %s: %s',
							message.user, message.text);
						return copyOrganizer(message);
					});
				}
				else {
					logger.debug(sprintf('No ATTENDEE with username: %s found',
						message.user));
					return Promise.resolve();
				}

			});
	};

	var quickReplyToAttendee = function (message) {
		return db.getLastAttendee()
			.then(function (user) {
				if (user) {
					message.user = sprintf('user%s', user.id);
					message.to = user.tn;
					return db.saveMessage(message)
						.then(function () {
							return catapult.sendMessage({
								tns: [message.to],
								text: message.text
							});
						})
						.then(function () {
							message.text =  sprintf('Org texted %s: %s',
								message.user, message.text);
							return copyOrganizer(message);
						});
				}
				else {
					logger.debug('Quick Reply to user not possible');
					return Promise.resolve();
				}
			});
	};

	var messageAttendees = function (message) {
		message.to = ATTENDEE;
		return db.saveMessage(message)
			.then(function (message) {
				return db.getTnsForRole(ATTENDEE);
			})
			.then(function (tns) {
				if (tns.length <= 0) {
					return Promise.resolve();
				}
				else {
					return catapult.sendMessage({
						tns: tns,
						text: message.text
					});
				}
			})
			.then(function () {
				message.text = sprintf('Broadcast: %s', message.text);
				return copyOrganizer(message);
			});
	};

	var addAttendee = function (user) {
		var message = 'You have been subscribed to Broadcast. ' +
			'Reply "stop" at any point to stop receiving messages';
		return db.saveUser(user)
			.then(function () {
				return catapult.sendMessage({
					tns: [user.tn],
					text: message
				});
			});
	};

	var addOrganizer = function (user) {
		var message = 'You have been subscribed to Broadcast as an organizer. ' +
			'Reply "stop" at any point to stop receiving messages';
		return db.saveUser(user)
			.then(function () {
				return catapult.sendMessage({
					tns: [user.tn],
					text: message
				});
			});
	};

	var sendUserSignupInstructions = function (tn) {
		var message = 'Please reply "start" to register as an attendee,' +
		' send "stop" at any time to remove yourself';
		return catapult.sendMessage({
			tns: [tn],
			text: message
		});
	};

	self.addUser = function (user) {
		return db.getUser(user.tn)
			.then(function (userExists) {
				if (!userExists) {
					if (user.role === ORGANZIER) {
						return addOrganizer(user);
					}
					else if (user.role === ATTENDEE) {
						return addAttendee(user);
					}
					else {
						Promise.reject('Unknown role');
					}
				}
				else {
					//If user exists return null
					return Promise.resolve(null);
				}
			});
	};

	self.getMessages = function () {
		return db.getMessages();
	};

	self.getUsers = function () {
		return db.getUsers();
	};

	self.removeUser = function (tn) {
		var message = 'You have been removed from all Broadcast messages. ' +
			'You can resubscribe at anytime by replying "start"';
		return db.removeUser(tn)
			.then(function () {
				return catapult.sendMessage({
					tns: [tn],
					text: message
				});
			});
	};

	self.getUserFromTn = function (tn) {
		return db.getUser(tn);
	};

	self.handleMessage = function (message) {
		logger.debug(
			sprintf('Handling Broadcast event for tn: %s with text: %s',
					message.fromNumber,
					message.text));
		return db.getUser(message.fromNumber)
			.then(function (user) {
				if (user) {
					logger.debug('User with tn: %s is an %s',
							message.fromNumber, user.role);
					if (message.text.toLowerCase().trim() === REMOVE_STRING) {
						logger.debug('Removing user from Broadcast');
						return self.removeUser(message.fromNumber);
					}
					else {
						if (user.role === ORGANZIER) {
							return handleOrganizerMessage(message);
						}
						else {
							logger.debug('Sending message to organizers');
							message.fromUsername = sprintf('user%s', user.id);
							message.firstAndLast = sprintf('%s %s', user.firstName, user.lastName);
							return handleAttendeeMessage(message);
						}
					}
				}
				else {
					if (message.text.toLowerCase().trim() === SUBSCRIBE_STRING) {
						logger.debug('Signing up new attendee');
						return self.addUser({
							tn: message.fromNumber,
							role: ATTENDEE
						});
					}
					else if (message.text.toLowerCase().trim() === ORGANZIER_SUB_STRING) {
						logger.debug('Signing up new organizer');
						return self.addUser({
							tn: message.fromNumber,
							role: ORGANZIER
						});
					}
					else {
						logger.debug('Sending signup instructions to user');
						return sendUserSignupInstructions(message.fromNumber);
					}
				}
			});
	};
}

module.exports = new Bandcaster();

