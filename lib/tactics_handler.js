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

var TacticsHandler = module.exports = function(dir){
    this.dir = dir;
    this.tactics = {};
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
            self.tactics[file.replace('.js', '')] = func();
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
        for(var key in self.tactics){
            try{
                self.tactics[key]._initialize(api);
            }catch(e){
                console.error('%s:%s', key, e.stack);
            }
        }
        callback(err);
    });
}

TacticsHandler.prototype.addDir = function(dirs){
    this.dir = this.dir.concat(dirs);
}

TacticsHandler.prototype.initialize = function(callback){
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
TacticsHandler.prototype.finalize = function(){
    for(var key in this.tactics){
        this.tactics[key]._finalize();
    }
}
TacticsHandler.prototype.getFunc = function(name){
    if(name in this.tactics){
        return this.tactics[name].run;
    }
    return null;
}
