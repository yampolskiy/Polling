exports.index = function(req, res){
  res.render('index', { title: 'Express-mods' })
};

var express = require("express");
var redis = require("redis");


exports.events = function(req, res) {
    const redisQueue = redis.createClient(6379, '127.0.0.1');
    redisQueue.publish("reporting", req.query["event_name"]);
    res.header("Content-type", "text/javascript");
    res.end(req.query["callback"] + "()");
}




