
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')  
  , http = require('http')
  , photoupload = require('./routes/photoupload')
  , photocrop = require('./routes/photocrop')
  , test = require('./test/test_runner')
  , path = require('path');


var app = express();

app.configure(function () {
    // port is an environment variable set by iisexpress, otherwise use 3000
    // to change the port edit the file on documents/IISExpress/config/applicationhost.config
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());    
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/public', express.static('public'));
    // this generates nicely indented HTML, useful for debugging
    app.locals.pretty = true;
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/photoupload', routes.index);
app.get('/photocrop', routes.index);
app.post('/photoupload', photoupload.index);
app.post('/photocrop', photocrop.index);
app.get('/test', test.index);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
