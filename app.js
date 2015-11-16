var bodyParser = require('body-parser');
var config     = require('./lib/config.js');
var db         = require('./lib/models');
var handlebars = require('express-handlebars');
var express    = require('express');
var favicon    = require('serve-favicon');
var logging    = require('./lib/logging.js');
var logger     = logging.winstonLogger;
var sprintf    = require('sprintf-js').sprintf;

var app = module.exports = express();

app.use(logging.requestLogger);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('models', require('./lib/models'));
/******************************************************************************
 * Set up routes
 *****************************************************************************/
app.use(config.catapult.end_point, require('./lib/routes/catapult_callback.js'));

/***************************************************************
* Force SSL on other paths
***************************************************************/
app.use(function (req, res, next) {
	if (process.env.NODE_ENV === 'production') {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect('https://' + req.headers.host + req.url);
		}
		else {
			return next();
		}
	}
	else {
		return next();
	}
});
app.use(favicon(__dirname + '/static/favicon.ico'));
app.use('/static', express.static('static'));
app.use('/messages/', require('./lib/routes/messages.js'));
app.use('/users/', require('./lib/routes/users.js'));

/******************************************************************************
 * Set up views
 *****************************************************************************/
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
	res.render('index', { bandcastNumber: config.bandcast_number });
});

/******************************************************************************
 * Set up error handlers
 *****************************************************************************/
// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('not found');
	err.status = 404;
	next(err);
});

// production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
	logger.error(sprintf(
		'error status=%s message=%s',
		err.status, err.message
	));
	logger.error(err.stack);
	res.status(err.status || 500);

	if (typeof(err.status) === 'undefined') {
		res.send({
			status: 'error',
			error: 'service error'
		});
	} else {
		res.send({
			status: 'error',
			error: err.message
		});
	}
});

/******************************************************************************
 * Migrate and sync Database
 * Set up server on configured port
 *****************************************************************************/
db.sequelize.sync().then(function () {
	app.listen(config.server.port, function () {
		logger.info('bandcast api listening on port ' + config.server.port);
	});
});
module.exports = app;