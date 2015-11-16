/*
 * Toggle config source on a single environment variable named NODE_ENV
 *
 * If NODE_ENV === 'test' then an environment that is pre-configured with
 * values in <testConfig> is used.  Otherwise, configuration values are
 * taken from environment variables defined in <config>.
 */
var config;
var testConfig;
var path = require('path');

config = {
	server: {
		port: process.env.PORT || 8081,
		url: process.env.SERVER_URL
	},
	admin_username: process.env.BANDCAST_DEFAULT_ADMIN,
	admin_password: process.env.BANDCAST_DEFAULT_PASSWORD,
	bandcast_number: process.env.BANDCAST_NUMBER,
	organizer_subscribe_string: process.env.ORGANIZER_SUBSCRIBE_STRING,
	organizer_string: 'organizers',
	attendee_sring: 'attendees',
	attendee_subscribe_string: 'start',
	user_stop_string: 'stop',
	logging: {
		request: {
			level: process.env.REQUEST_LOG_LEVEL || 'default'
		},
		app: {
			level: process.env.APP_LOG_LEVEL || 'debug'
		}
	},
	db: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		options: {
			host: process.env.DB_HOST,
			dialect: 'postgres',
			port: process.env.DB_PORT
		}
	},
	catapult: {
		api_base_url: process.env.CATAPULT_BASE_URL ||
			'https://api.catapult.inetwork.com/v1',
		user_id: process.env.CATAPULT_USER_ID,
		api_token: process.env.CATAPULT_API_TOKEN,
		api_secret: process.env.CATAPULT_API_SECRET,
		end_point: process.env.CATAPULT_END_POINT || '/catapult'
	}
};

testConfig = {
	server: {
		port: 8081,
		url: 'http://localhost:8081/'
	},
	bandcast_number: '+19191231234',
	organizer_string: 'organizers',
	attendee_sring: 'attendees',
	attendee_subscribe_string: 'start',
	user_stop_string: 'stop',
	logging: {
		request: {
			level: 'dev'
		},
		app: {
			level: process.env.APP_LOG_LEVEL || 'info'
		},
	},
	db: {
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
		options: {
			host: process.env.DB_HOST,
			dialect: 'postgres',
			port: process.env.DB_PORT
		}
	},
	catapult: {
		api_base_url: '',
		user_id: '',
		api_token: '',
		api_secret: '',
		end_point: '/catapult'

	}
};

module.exports = (process.env.NODE_ENV === 'test') ? testConfig : config;
