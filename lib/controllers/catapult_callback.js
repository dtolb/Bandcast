var bandcast = require('./../broadcast');
var config   = require('./../config');
var logger   = require('./../logging').winstonLogger;
var Promise  = require('bluebird');
var sprintf  = require('sprintf-js').sprintf;

module.exports.event = function (req, res, next) {
	var hasBody = (typeof req.body !== 'undefined' && req.body !== null);
	res.sendStatus(201); //Immediately respond to request
	if (hasBody) {
		var hasEvent = (typeof req.body.eventType !== 'undefined');
		if (hasEvent) {
			if (req.body.eventType === 'sms') {
				logger.debug('Starting broadcast event');
				bandcast.handleMessage({
					fromNumber: req.body.from,
					text: req.body.text
				})
				.catch(function (error) {
					logger.error(error);
				});
			}
			else {
				logger.debug(sprintf(
					'Catapult Event Type: %s is not yet supported',req.body.eventType));
			}
		}
		else {
			logger.info('Catapult Event Type not sent');
		}
	}
	else {
		logger.info('Catapult Body not sent');
	}
};
