var Task = require('./lib/task');
var AgentManager = require('./lib/agent_manager');
var PluginHandler = require('./lib/plugin_handler');
var ph = new PluginHandler("./plugins");
var am = new AgentManager("./test");
var async = require('async');
var config = require('./config');
var crawler = require('./lib/crawler');

crawler.debug.on('limit_request', function(tag, obj){
    console.log('limit_request %s[%s]',tag,obj.url);
});
crawler.debug.on('request_get_json', function(tag, obj){
    console.log('request_get_json %s[%s]',tag,obj.url);
});

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


