var url = require('url');

var createRequest = require('./create_request');
var LimitTable = require('./limit_table');

var limitTable = exports.limitTable = new LimitTable();

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
    if(check.func()){
        dispatch(opt, callback);
    }else{
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
            return callback(err, rawbody);
        }
        var obj = null;
        try{
            obj = JSON.parse(rawbody);
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
};

