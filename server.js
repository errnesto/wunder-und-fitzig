var express    = require('express');
var app        = express();
var url        = require('url');
var nodejsx    = require('node-jsx').install();
var React      = require('react');
var Page       = require('./client.jsx');


if (app.get('env') == 'development') {
	app.use(require('connect-livereload')({
	  port: 35729
	}));
}

app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function(req, res){
	var path   = url.parse(req.url).pathname;
	var page   = Page({path: path});
  var markup = React.renderComponentToString(page);
  
  res.send('<!doctype html>\n' + markup);
});

app.listen(3000);