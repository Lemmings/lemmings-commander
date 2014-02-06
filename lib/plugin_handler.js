var funcs = require("./funcs");

var PluginHandler = module.exports = function(dir){
    this.dir = dir;
    this.plugin = {};
};

PluginHandler.prototype.initialize = function(callback){
    var self = this;
    funcs.scanDir(this.dir, function(dir, file, callback){
        funcs.readFunctionFile(dir + '/' + file, function(err, func){
            if(err){
                return callback(err);
            }
            self.plugin[file] = func();
            callback(err);
        });
    }, function(err){
        if(err){
            return callback(err);
        }
        for(var key in self.plugin){
            self.plugin[key].initialize(require);
        }
        callback(err);
    });
}
PluginHandler.prototype.finalize = function(){
    for(var key in this.plugin){
        this.plugin[key].finalize();
    }
}
PluginHandler.prototype.getFunc = function(name){
    if(name in this.plugin){
        return this.plugin[name].run;
    }
    return null;
}
