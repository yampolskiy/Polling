(function() {
    var app, express, io, redis;
    redis = require('redis');
    express = require('express');
    io = require('socket.io');
    var MemoryStore = express.session.MemoryStore,

    app = module.exports = express.createServer();

    app.configure(function() {
        app.set('views', __dirname + '/views');
        app.set('view engine', 'jade');
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        //app.use(express.session({ store: new MemoryStore({ reapInterval: 60000 * 10 }) }));
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
        console.log("Connected to redis");


        console.log("Client id", socket.id);
        setInterval(function() {
            r.get("everyone_yes", function(err ,reply) {
                return io.sockets.emit('count_yes', {
                    number: reply
                } );


                }   );

            r.get("everyone_no", function(err ,reply) {
                return io.sockets.emit('count_no', {
                    number: reply
                } );


            }   );


        }, 1200);

        socket.on('vote', function(data) {
//          req.session.id = req.session.id ? req.session.id : guidGenerator();
            var json =  JSON.stringify(data);
            var obj = JSON.parse(json);
            console.log("Received vote from client ", obj, " and data ", obj.data.vote);


            var key = 'vote:' + socket.id;
            // old vote


            var oldVote = null;   //r.get("votes", socket.id);                // for now i won't use hset/hget
            r.get(key, function(err, reply) {
                oldVote = reply;
                var newVote = obj.data.vote;

                if (oldVote == null || oldVote == undefined) {
                    oldVote = false;
                }

                console.log("Client ", key, " : OldVote = ", oldVote, "NewVote = ", newVote);
                if (oldVote.toString() == newVote.toString()) {
                    // no-op
                } else {
                    //var everyone_yes = null;
                    //var everyone_no = null;
                    if (newVote.toString() == "true") {
                        console.log('Counting the true');
                        r.incr("everyone_yes")
                        r.decr("everyone_no")
                    }   else {
                        r.decr("everyone_yes")
                        r.incr("everyone_no")
                    }
                    //console.log("Currently everyone_yes=", everyone_yes, " and everyone_no=", everyone_no);
                }
                r.set(key, newVote.toString());
                console.log('Just set the key to ', newVote);
            });




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
