var funcs = require("./funcs");
var Agent = require("./agent");
var async = require('async');

var AgentManager = module.exports = function(dir){
    this.dir = dir;
    this.agents = {};
};

var scan = function(self, dir, agentHandler, config, callback){
    funcs.scanDir(dir, function(dir, file, scancallback){
        if(!file.match(/(\.)(json)$/g)){
            return scancallback(null);
        }
        funcs.readJsonFile(dir + '/' + file, function(err, data){
            if(err){
                return scancallback(err);
            }
console.log('agent read,%s', dir + '/' + file);
            self.agents[file] = new Agent(agentHandler, file, data, config['agent/'+file]);
            scancallback(err);
        });
    }, function(err){
        if(err){
            return callback(err);
        }
        callback(err);
    });
}

AgentManager.prototype.addDir = function(dirs){
    this.dir = this.dir.concat(dirs);
}

AgentManager.prototype.initialize = function(agentHandler, config, callback){
    var self = this;
    var tasks = [];
    this.dir.forEach(function(dir){
        tasks.push(function(next){
            scan(self, dir, agentHandler, config, function(err){
                next(err);
            });
        });
    });
    async.waterfall(tasks, function(err){
        callback(err);
    });
}
AgentManager.prototype.run = function(){
    for(var key in this.agents){
        this.agents[key].run();
    }
}
AgentManager.prototype.finalize = function(){
}
AgentManager.prototype.heartbeat = function(){
    for(var key in this.agents){
        this.agents[key].heartbeat();
    }
}
