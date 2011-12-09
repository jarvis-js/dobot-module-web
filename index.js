module.exports = function(bot, module) {
	var express = require('express')

	var app = express.createServer();

	app.configure(function() {
		app.use(express.methodOverride());
		app.use(express.bodyParser());
		app.use(app.router);
	});

	app.configure('development', function() {
		app.use(express.static(__dirname + '/public'));
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	});

	app.configure('production', function() {
		var oneYear = 31557600000;
		app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
		app.use(express.errorHandler());
	});

	app.set('view engine', 'jade');
	app.set('view', __dirname + '/views');

	var vars = {
		host: module.options.connection || 'http://localhost:8888',
		title: 'Dobot'
	};

	app.get('/', function(req, res) {
		res.render( __dirname + '/views/index.jade', vars);
	});

	app.listen(module.options.port || 3000);

	module.unload = function() {
		app.close();
	};
};