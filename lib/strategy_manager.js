var funcs = require("./funcs");
var Strategy = require("./strategy");
var async = require('async');

var StrategyManager = module.exports = function(dir){
    this.dir = dir;
    this.strategys = {};
};

var scan = function(self, dir, strategyHandler, config, callback){
    funcs.scanDir(dir, function(dir, file, scancallback){
        if(!file.match(/(\.)(json)$/g)){
            return scancallback(null);
        }
        funcs.readJsonFile(dir + '/' + file, function(err, data){
            if(err){
                return scancallback(err);
            }
console.log('strategy read,%s', dir + '/' + file);
            self.strategys[file] = new Strategy(strategyHandler, file, data, config['strategy/'+file]);
            scancallback(err);
        });
    }, function(err){
        if(err){
            return callback(err);
        }
        callback(err);
    });
}

StrategyManager.prototype.addDir = function(dirs){
    this.dir = this.dir.concat(dirs);
}

StrategyManager.prototype.initialize = function(strategyHandler, config, callback){
    var self = this;
    var tasks = [];
    this.dir.forEach(function(dir){
        tasks.push(function(next){
            scan(self, dir, strategyHandler, config, function(err){
                next(err);
            });
        });
    });
    async.waterfall(tasks, function(err){
        callback(err);
    });
}
StrategyManager.prototype.run = function(){
    for(var key in this.strategys){
        this.strategys[key].run();
    }
}
StrategyManager.prototype.finalize = function(){
}
StrategyManager.prototype.heartbeat = function(){
    for(var key in this.strategys){
        this.strategys[key].heartbeat();
    }
}
