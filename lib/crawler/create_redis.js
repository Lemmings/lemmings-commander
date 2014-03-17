var redis = require('redis');

var get_host_object = function(hostname){
    var tok = hostname.split(':');
    var port = 6379;
    if(tok.length === 2){ port = tok[1]; }
    if(tok[0] === ''){ tok[0] = 'localhost'; }
    return {
        host : tok[0],
        port : port,
    }
}

var get_text_raw = exports.get_text_raw = function(hostname, key, callback){
    var obj = get_host_object(hostname);
    var cl = redis.createClient(obj.port, obj.host);
    cl.get(key, function(err, val){
        if(err){
            return callback(err, val);
        }
        callback(err, val);
    });
    cl.quit();
};

var get_text_json = exports.get_text_json = function(hostname, key, callback){
    var obj = get_host_object(hostname);
    var cl = redis.createClient(obj.port, obj.host);
    cl.get(key, function(err, val){
        if(err){
            return callback(err, val);
        }
        var obj = null;
        try{
            obj = JSON.parse(val);
        }catch(e){
            err = e;
        }
        callback(err, obj);
    });
    cl.quit();
};

var get_hash_raw = exports.get_hash_raw = function(hostname, key, callback){
    var obj = get_host_object(hostname);
    var cl = redis.createClient(obj.port, obj.host);
    cl.hgetall(key, function(err, val){
        if(err){
            return callback(err, val);
        }
        callback(err, val);
    });
    cl.quit();
};

var get_hash_json = exports.get_hash_json = function(hostname, key, callback){
    var obj = get_host_object(hostname);
    var cl = redis.createClient(obj.port, obj.host);
    cl.hgetall(key, function(err, val){
        if(err){
            return callback(err, val);
        }
        if(val === null){
            return callback(new Error('value is null'), val);
        }
        var obj = {};
        Object.keys(val).forEach(function(key){
            try{
                obj[key] = JSON.parse(val[key]);
            }catch(e){
                err = e;
            }
        });
        callback(err, obj);
    });
    cl.quit();
};


