var http = require('http');
var https = require('https');
//クローラーなので気にしない
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var createRequest = function(protocol, opt){
    return function(callback){
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
        req.on('error', function(error){
            console.error("request error %s:%s", opt.hostname, err.stack);
            callback(err, null);
        });
        req.end();
        return req;
    };
}

var createHttpProtocol = exports.createHttpProtocol = function(opt){
    return createRequest(http, opt);
}
var createHttpsProtocol = exports.createHttpsProtocol = function(opt){
    return createRequest(https, opt);
}
