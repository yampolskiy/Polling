(function() {
    var app, express, io;
    express = require('express');
    io = require('socket.io');
    app = module.exports = express.createServer();

    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(require('stylus').middleware({
            src: __dirname + '/public'
        }));
        app.use(app.router);
        return app.use(express.static(__dirname + '/public'));
    });

    app.configure('development', function() {
        return app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    app.configure('production', function() {
        return app.use(express.errorHandler());
    });

    io = require('socket.io').listen(app);

    io.sockets.on('connection', function(socket) {
        setInterval(function() {
//            return io.sockets.emit('count', {
//                number: count
//            });
        }, 1200);
    });

    app.get('/server', function(req, res) {
        return res.render('index', {
            title: 'node.js express socket.io counter'
        });
    });

    if (!module.parent) {
        app.listen(10927);
        console.log("Express server listening on port %d", app.address().port);
    }

}).call(this);
