var Task = require('./lib/task');
var AgentManager = require('./lib/agent_manager');
var PluginHandler = require('./lib/plugin_handler');
var ph = new PluginHandler("./plugins");
var am = new AgentManager("./test");
var async = require('async');
var config = require('./config');

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

var tasks = [];
config.setup(tasks);
tasks.push(function(next){
    ph.initialize(function(err){
        next(err);
    });
});
tasks.push(function(next){
    am.initialize(ph, function(err){
        am.run();
        next(err);
    });
});
async.waterfall(tasks, function(err, val){
    update( function(){
        am.heartbeat();
    } );
});


