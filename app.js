
/**
 * Module dependencies.
 */

var express = require('express');
var cacheManifest = require('connect-cache-manifest');

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/index.html', routes.index);
app.get('/users', user.list);

// cache-manifest
app.use(cacheManifest({
  manifestPath: '/application.manifest',
  files: [{
    // file: __dirname + '/public/javascripts/test.js',
    path: '/javascripts/test.js'
  }, {
    path: '/index.html'
  }, {
    dir: __dirname + '/public',
    prefix: '/'
  }],
  networks: ['*'],
  fallbacks: []
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
