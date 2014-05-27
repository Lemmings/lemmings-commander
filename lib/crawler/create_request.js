var http = require('http');
var https = require('https');
//クローラーなので気にしない
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var createRequest = function(protocol, opt, postdata){
    var TIMEOUT = 60;
    return function(callback){
        var uptime = process.uptime();
        var req = protocol.request(opt, function(res){
            var data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk){
                data += chunk;
            });
            res.on('error', function(err){
                console.error("response error %s:%s", opt.hostname, err.stack);
                callback(err, data);
            });
            res.on('end', function(){
                callback(null, data);
            });
        });
        req.setTimeout(TIMEOUT * 1000);
        req.on('timeout', function() {
            console.error('request timed out %d sec', process.uptime() - uptime);
            req.abort()
        });
        req.on('error', function(err){
            console.error("request error %s:%s", opt.hostname, err.stack);
            callback(err, null);
        });
        if(opt.method === 'POST') req.write(postdata);
        req.end();
        return req;
    };
}

var createHttpProtocol = exports.createHttpProtocol = function(opt, postdata){
    return createRequest(http, opt, postdata);
}
var createHttpsProtocol = exports.createHttpsProtocol = function(opt, postdata){
    return createRequest(https, opt, postdata);
}
