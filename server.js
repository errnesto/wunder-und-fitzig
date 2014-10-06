var express    = require('express');
var app        = express();
var url        = require('url');
var favicon    = require('serve-favicon');
var nodejsx    = require('node-jsx').install();
var React      = require('react');
var Page       = require('./app/jsx/page.jsx');


if (app.get('env') == 'development') {
	app.use(require('connect-livereload')());
}

app.use('/assets', express.static(__dirname + '/assets'));

var renderApp = function (req, res, next) {
	if (req.url != '/assets') {
		var path   = url.parse(req.url).pathname;
		var page   = Page({path: path});
	  var markup = React.renderComponentToString(page);
	  
	  res.send('<!doctype html>\n' + markup);
	}
}

app.use(favicon(__dirname + '/assets/favicon.ico'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use(renderApp);

app.listen(65432);