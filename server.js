(function() {
    var app, express, io, redis;
    redis = require('redis');
    express = require('express');
    io = require('socket.io');
    app = module.exports = express.createServer();

    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(express.session({ store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
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
        const r = redis.createClient(6379, '127.0.0.1');

        setInterval(function() {

        }, 1200);

        socket.on('vote', function(data) {
            req.session.id = req.session.id ? req.session.id : guidGenerator();
            r.hset("votes", req.session.id, data.vote)
        });
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

    function guidGenerator() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }


}).call(this);
