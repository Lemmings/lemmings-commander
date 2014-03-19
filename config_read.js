var iniparser = require('iniparser');

var readApp = exports.readApp = function(configfile, callback){
    iniparser.parse(configfile, function(err, obj){
        if(err){
            return callback(err, null);
        }
        var config = {};
        Object.keys(obj).forEach(function(section){
            config[section] = {};
            Object.keys(obj[section]).forEach(function(key){
                config[section][key] = JSON.parse(obj[section][key]);
            });
        });
        callback(err, config);
    });
}
