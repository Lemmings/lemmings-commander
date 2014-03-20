var async = require('async');
var PluginHandler = require('./lib/plugin_handler');
var AgentManager = require('./lib/agent_manager');
var Task = require('./lib/task');
var config = require('./config');

var init = function(){
    var HOSTNAME = process.env.HOSTNAME;
    var PORT = process.env.PORT || 3000;
    var tasklists = [];

    var pluginHandler = new PluginHandler([]);
    var agentManager = new AgentManager([]);

    var task = new Task(100, 1);

    task.start();
    task.on('report', function(count){
    //    console.log('exec : ' + count);
    });
    var update = function(func){
        task.add(function(){
            func();
            update(func);
        });
    };

    
    config.setup('./config/app.ini', tasklists, pluginHandler, agentManager);
    tasklists.push(function running_agent(next){
        update( function(){
            agentManager.heartbeat();
        });
    });
    return tasklists;
}


var main = function(){
    process.on("uncaughtException", function(e){
        console.log(process.uptime());
        console.log(e.stack);
    });
    async.waterfall(init(), function (err, result) {
        if(err){
            throw err;
        }
    });
}

main();
