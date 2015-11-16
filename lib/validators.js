var Joi       = require('joi');
var Promise   = require('bluebird');
var e164Regex = /^\+1[0-9]{10,14}$/g;

module.exports.isE164 = function (number) {
	return number.match(e164Regex) !== null;
};

var messageSchema = Joi.object().keys({
	text: Joi.string().required(),
	from: Joi.string().required().regex(e164Regex)
});
module.exports.incomingMessage = function (message) {
	var value = Joi.validate(message, messageSchema);
	if (value.error) {
		return false;
	}
	else {
		return true;
	}
};

var userSchema = Joi.object().keys({
	role: Joi.string().required().regex(/^(attendees|organizers)/i),
	tn: Joi.string().required().regex(e164Regex),
	firstName: Joi.string().allow(''),
	lastName: Joi.string().allow('')
});
module.exports.newUser = function (user) {
	var value = Joi.validate(user, userSchema);
	if (value.error) {
		return false;
	}
	else {
		return true;
	}
};