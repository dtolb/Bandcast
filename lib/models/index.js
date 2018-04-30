var config    = require('./../config').db;  // we use node-config to handle environments
var Sequelize = require('sequelize');

// initialize database connection
var sequelize = new Sequelize(config.url);

// load models
var models = [
	'Message',
	'User'
];
models.forEach(function (model) {
	module.exports[model] = sequelize.import(__dirname + '/' + model);
});

// export connection
module.exports.sequelize = sequelize;