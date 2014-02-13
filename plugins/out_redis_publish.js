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
    rcl.publish(args.channel, JSON.stringify({key : args.key, data : data}));
    rcl.quit();
    callback(null);
};
