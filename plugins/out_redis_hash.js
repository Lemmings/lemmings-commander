var redis = null;
exports.initialize = function(){
    redis = require('redis');
};
exports.finalize = function(){
};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var data = inputTools.kvs[args.input];
    var rcl = redis.createClient();
    rcl.hset(args.hashkey, args.hashname, JSON.stringify(data), function(err){
        callback(err);
    });
    rcl.quit();
};
