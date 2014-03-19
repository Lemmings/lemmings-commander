var async = require('async');
var funcs = require("./funcs");
var header =   "'use strict';var fs,require,exports = {"
             + "_initialize : function(api){"
             + " require = api.require;"
             + " fs = api.fs;"
             + " if(exports.initialize)exports.initialize();"
             + "},"
             + "_finalize : function(){"
             + " if(exports.finalize)exports.finalize();"
             + "},"
             + "};"
             ;
var footer = "return exports;";

var PluginHandler = module.exports = function(dir){
    this.dir = dir;
    this.plugin = {};
};

var scan = function(self, dir, callback){
    funcs.scanDir(dir, function(dir, file, scancallback){
        if(!file.match(/(\.)(js)$/g)){
            return scancallback(null);
        }
        funcs.readFunctionFile(dir + '/' + file, header, footer, function(err, func){
            if(err){
                return scancallback(err);
            }
            self.plugin[file.replace('.js', '')] = func();
            scancallback(err);
        });
    }, function(err){
        if(err){
            return callback(err);
        }
        var api = {
            require : require,
            fs : require('fs'),
        };
        for(var key in self.plugin){
            try{
                self.plugin[key]._initialize(api);
            }catch(e){
                console.error('%s:%s', key, e.stack);
            }
        }
        callback(err);
    });
}

PluginHandler.prototype.addDir = function(dirs){
    this.dir = this.dir.concat(dirs);
}

PluginHandler.prototype.initialize = function(callback){
    var self = this;
    var tasks = [];
    this.dir.forEach(function(dir){
        tasks.push(function(next){
            scan(self, dir, function(err){
                next(err);
            });
        });
    });
    async.waterfall(tasks, function(err){
        callback(err);
    });
}
PluginHandler.prototype.finalize = function(){
    for(var key in this.plugin){
        this.plugin[key]._finalize();
    }
}
PluginHandler.prototype.getFunc = function(name){
    if(name in this.plugin){
        return this.plugin[name].run;
    }
    return null;
}
