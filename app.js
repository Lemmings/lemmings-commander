var async = require('async');
var create_http_server = require('./server/http_server');
var PluginHandler = require('./lib/plugin_handler');
var AgentManager = require('./lib/agent_manager');
var Task = require('./lib/task');

var init = function(){
    var HOSTNAME = process.env.HOSTNAME;
    var PORT = process.env.PORT || 3000;
    var tasklists = [];
    var config = {};

    var pluginHandler = new PluginHandler('./plugins');
    var agentManager = new AgentManager('./agents');


    var task = new Task(1000, 1);

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

    // サーバー設定ファイル読み込み
    tasklists.push(function config_phase1_initialize(next){
        pluginHandler.initialize(function(err){
            agentManager.initialize(pluginHandler, function(err){
                next(err);
            });
        });
    });
    tasklists.push(function task_initialize(next){
        update( function(){
            agentManager.heartbeat();
        } );
       next(null);
    });
    tasklists.push(function frontend_initialize(next){
        var instanceHTTPServer = create_http_server();

        instanceHTTPServer.listen(PORT, function(config){
            console.log('HTTP READY PORT:' + PORT);
            next(null);
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
