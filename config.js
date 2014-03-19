var config_read = require('./config_read');
var crawler = require('./lib/crawler');

var setup = exports.setup = function(tasks){
    tasks.push(function config_ini(next){
        config_read.readApp('config/app.ini', function(err, config){
            Object.keys(config.requestlimit).forEach(function(key){
                var waittime = config.requestlimit[key][0];
                var count = config.requestlimit[key][1];
                console.log('requestlimit host[%s],wait[%d],count[%d]', key, waittime, count);
                crawler.limitTable.set(key, count, waittime);
            });
            next(err);
        });
    });
}
