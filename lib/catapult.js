var bandwidth = require('node-bandwidth');
var config    = require('./config');
var logger    = require('./logging').winstonLogger;
var Promise   = require('bluebird');
var sendSMS   = Promise.promisify(bandwidth.Message.create);

module.exports.sendMessage = function (message) {
	var bwClient = new bandwidth.Client(
		config.catapult.user_id,
		config.catapult.api_token,
		config.catapult.api_secret
	);

	var buildMessage = function (message) {
		var fromNumber = config.bandcast_number;
		var outMessage = [];
		for (var i = 0; i <= message.tns.length - 1; i+=1) {
			var mess = {
				from: fromNumber,
				to: message.tns[i],
				text: message.text
			};
			outMessage.push(mess);
		}
		return outMessage;
	};

	var outMessage = buildMessage(message);
	return sendSMS(bwClient, outMessage)
		.catch(function (e) {
			logger.error('Error when sending broadcast');
			throw e;
		});

};