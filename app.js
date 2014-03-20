var async = require('async');
var TacticsHandler = require(__dirname+'/lib/tactics_handler');
var StrategyManager = require(__dirname+'/lib/strategy_manager');
var Task = require(__dirname+'/lib/task');
var config = require(__dirname+'/config');

var init = function(){
    var HOSTNAME = process.env.HOSTNAME;
    var PORT = process.env.PORT || 3000;
    var tasklists = [];

    var tacticsHandler = new TacticsHandler([]);
    var strategyManager = new StrategyManager([]);

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

    
    config.setup('./config/app.ini', tasklists, tacticsHandler, strategyManager);
    tasklists.push(function running_strategy(next){
        update( function(){
            strategyManager.heartbeat();
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
