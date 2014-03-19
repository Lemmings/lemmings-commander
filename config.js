var config_read = require('./config_read');
var crawler = require('./lib/crawler');

var setup = exports.setup = function(filename, tasks, pluginHandler, agentManager){
    var plugins = [];
    var agents = [];
    var config = {};
    tasks.push(function config_ini(next){
        config_read.readApp(filename, function(err, _config){
            config = _config;
            Object.keys(config.requestlimit).forEach(function(key){
                var waittime = config.requestlimit[key][0];
                var count = config.requestlimit[key][1];
                console.log('setup requestlimit host[%s],wait[%d],count[%d]', key, waittime, count);
                crawler.limitTable.set(key, count, waittime);
            });
            Object.keys(config.strategy).forEach(function(key){
                switch(key){
                case 'plugindir':
                    plugins = config.strategy[key];
                    break;
                case 'agentdir':
                    agents = config.strategy[key];
                    break;
                }
            });
            next(err);
        });
    });
    tasks.push(function config_phase1_initialize(next){
        pluginHandler.addDir(plugins);
        pluginHandler.initialize(function(err){
            next(err);
        });
    });
    tasks.push(function config_phase2_initialize(next){
        agentManager.addDir(agents);
        agentManager.initialize(pluginHandler, config, function(err){
            next(err);
        });
    });
    tasks.push(function task_initialize(next){
        agentManager.run();
        next(null);
    });
}
