var request = require('request-promise');
var URL = require('url');

module.exports = {
	request : function (options) {
		options.url = URL.resolve(document.location.href, options.url);
		return request(options);
	},

	ATTENDEES : 'attendees',
	ORGANIZERS : 'organizers'
}