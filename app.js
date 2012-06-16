
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/events', routes.events)

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

// Socket Listener

var io = require('socket.io').listen(8081);
var sys = require('util');
var redis = require('redis');

io.sockets.on('connection', function(socket) {
    socket.emit('recv-action', { message : "connected to the server" } );

    const redisQueue = redis.createClient(6379, '127.0.0.1');
    redisQueue.subscribe('reporting');

    redisQueue.on("message", function(channel, message) {
        socket.emit('recv-action', { message : message } );
    });
});
