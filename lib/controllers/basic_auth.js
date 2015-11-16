var basicAuth = require('basic-auth');
var config    = require('./../config.js');

var username = config.admin_username;
var password = config.admin_password;
module.exports = function (req, res, next) {
	var user = basicAuth(req);
	if (!user || user.name !== username || user.pass !== password) {
		res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
		return res.sendStatus(401);
	}

	next();
};