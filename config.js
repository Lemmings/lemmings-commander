var config_read = require('./config_read');
var crawler = require('./lib/crawler');

var setup = exports.setup = function(filename, tasks, tacticsHandler, strategyManager){
    var tactics = [];
    var strategy = [];
    var config = {};
    tasks.push(function config_ini_read(next){
        config_read.readApp(filename, function(err, _config){
            config = _config;
            Object.keys(config.requestlimit).forEach(function(key){
                var waittime = config.requestlimit[key][0];
                var count = config.requestlimit[key][1];
                console.log('setup requestlimit host[%s],wait[%d],count[%d]', key, waittime, count);
                crawler.limitTable.set(key, count, waittime);
            });
            Object.keys(config.commander).forEach(function(key){
                switch(key){
                case 'tacticsdir':
                    tactics = config.commander[key];
                    break;
                case 'strategydir':
                    strategy = config.commander[key];
                    break;
                }
            });
            next(err);
        });
    });
    tasks.push(function config_phase1_initialize(next){
        tacticsHandler.addDir(tactics);
        tacticsHandler.initialize(function(err){
            next(err);
        });
    });
    tasks.push(function config_phase2_initialize(next){
        strategyManager.addDir(strategy);
        strategyManager.initialize(tacticsHandler, config, function(err){
            next(err);
        });
    });
    tasks.push(function task_initialize(next){
        strategyManager.run();
        next(null);
    });
}
