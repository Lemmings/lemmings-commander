var iniparser = require('iniparser');

var readApp = exports.readApp = function(configfile, callback){
    iniparser.parse(configfile, function(err, obj){
        if(err){
            return callback(err, null);
        }
        var config = {};
        Object.keys(obj).forEach(function(section){
            switch(section){
            case 'strategy':
                config.strategy = {};
                Object.keys(obj.strategy).forEach(function(key){
                    switch(key){
                    case 'plugindir':
                        config.strategy[key] = JSON.parse(obj.strategy[key]);
                        break;
                    case 'agentdir':
                        config.strategy[key] = JSON.parse(obj.strategy[key]);
                        break;
                    }
                });
                break;
            case 'requestlimit':
                config.requestlimit = {};
                Object.keys(obj.requestlimit).forEach(function(key){
                    config.requestlimit[key] = JSON.parse(obj.requestlimit[key]);
                });
                break;
            }
        });
        callback(err, config);
    });
}
