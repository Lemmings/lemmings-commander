var iniparser = require('iniparser');

var readApp = exports.readApp = function(configfile, callback){
    iniparser.parse(configfile, function(err, obj){
        if(err){
            return callback(err, null);
        }
        var config = {};
        if('requestlimit' in obj){
            config.requestlimit = {};
            Object.keys(obj.requestlimit).forEach(function(key){
                config.requestlimit[key] = JSON.parse(obj.requestlimit[key]);
            });
        }
        callback(err, config);
    });
}
