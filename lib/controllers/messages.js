//controller for messages
var bandcast   = require('./../broadcast');
var db         = require('./../db');
var validators = require('./../validators');

module.exports.getMessages = function (req, res, next) {
	bandcast.getMessages()
		.then(function (messages) {
			res.status(200);
			res.send({
				messages: messages
			});
		})
		.catch(function (error) {
			next(error);
		});
};

module.exports.validateMessage = function (req, res, next) {
	if (req.body !== 'undefined') {
		if (validators.incomingMessage(req.body))
		{
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

module.exports.validateUser = function (req, res, next) {
	bandcast.getUserFromTn(req.body.from)
		.then(function (user) {
			if (!user) {
				res.status(400).send('User does not exist');
			}
			else {
				next();
			}
		})
		.catch(function (error) {
			next(error);
		});
};

module.exports.sendMessage = function (req, res, next) {
	var message = {
		fromNumber: req.body.from,
		text: req.body.text
	};
	bandcast.handleMessage(message)
		.then(function () {
			res.status(201);
			res.send();
		})
		.catch(function (error) {
			next(error);
		});
};
