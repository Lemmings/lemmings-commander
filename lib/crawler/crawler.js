var url = require('url');
var fs = require('fs');

var debug = require('./debug');
var createRequest = require('./create_request');
var LimitTable = require('./limit_table');

var limitTable = exports.limitTable = new LimitTable();
exports.debug = debug;

var dispatch = function(opt, callback){
    var select = null;
    switch(opt.protocol){
    case "http:":
        opt.agent = false;
        select = createRequest.createHttpProtocol(opt);
        break;
    case "https:":
        opt.agent = false;
        select = createRequest.createHttpsProtocol(opt);
        break;
    }
    if(select){
        select(callback);
    }else{
        callback(new Error('unknown protocol:' + opt.protocol), null);
    }
}

var limit_request = function(urlstr, callback){
    var opt = url.parse(urlstr);
    var check = limitTable.get(opt.hostname);
    debug.emit('limit_request', 'try', {url:urlstr});
    if(check.func()){
        debug.emit('limit_request', 'request', {url:urlstr});
        dispatch(opt, function(err, val){
            debug.emit('limit_request', 'response', {url:urlstr});
            callback(err, val);
        });
    }else{
        debug.emit('limit_request', 'wait', {url:urlstr});
        setTimeout(function(){
            limit_request(urlstr, callback);
        }, check.time * 1000);
    }
}

var request_get_raw = exports.request_get_raw = function(urlstr, callback){
    limit_request(urlstr, callback);
};
var request_get_json = exports.request_get_json = function(urlstr, callback){
    limit_request(urlstr, function(err, rawbody){
        if(err){
            debug.emit('request_get_json', 'request_error', {url:urlstr});
            return callback(err, rawbody);
        }
        var obj = null;
        try{
            obj = JSON.parse(rawbody);
        }catch(e){
            debug.emit('request_get_json', 'json_error', {url:urlstr});
            err = e;
        }
        callback(err, obj);
    });
};
var readfile_raw = exports.readfile_raw = function(file, calllback){
    fs.readFile(file, calllback);
};
var readfile_json = exports.readfile_json = function(file, callback){
    fs.readFile(file, 'utf8', function(err, raw){
        if(err){
            return callback(err, raw);
        }
        var obj = null;
        try{
            obj = JSON.parse(raw);
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
};

var child_process = require('child_process');
var exec_command_raw = exports.exec_command_raw = function(cmd, callback){
    child_process.exec(cmd, callback);
};
var exec_command_json = exports.exec_command_json = function(cmd, callback){
    child_process.exec(cmd, function(err, stdout, stderr){
        if(err){
            return callback(err, stdout);
        }
        var obj = null;
        try{
            obj = JSON.parse(stdout);
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
};

var createRedis = exports.redis = require('./create_redis');
