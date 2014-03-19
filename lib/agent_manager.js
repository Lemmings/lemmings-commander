var funcs = require("./funcs");
var Agent = require("./agent");

var AgentManager = module.exports = function(dir){
    this.dir = dir;
    this.agents = {};
};

var scan = function(self, dir, agentHandler, callback){
    funcs.scanDir(dir, function(dir, file, callback){
        if(!file.match(/(\.)(json)/g)){
            return callback(null);
        }
        funcs.readJsonFile(dir + '/' + file, function(err, data){
            if(err){
                return callback(err);
            }
            self.agents[file] = new Agent(agentHandler, file, data);
            callback(err);
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

AgentManager.prototype.initialize = function(agentHandler, callback){
    var self = this;
    this.dir.forEach(function(dir){
        scan(self, dir, agentHandler, callback);
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
