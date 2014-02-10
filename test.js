var Task = require('./lib/task');
var AgentManager = require('./lib/agent_manager');
var PluginHandler = require('./lib/plugin_handler');
var ph = new PluginHandler("./plugins");
var am = new AgentManager("./test");

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


ph.initialize(function(err){
am.initialize(ph, function(err){
    am.run();
    update( function(){
        am.heartbeat();
    } );
});
});

