var fs = require('fs');
var async = require('async');

var readJsonFile = exports.readJsonFile = function(path, callback){
    fs.readFile(path, function(err, data){
        if(err){
            return callback(err, null);
        }
        try{
            var j = JSON.parse(data);
            callback(err, j);
        }catch(err){
            console.log("%s", path);
            throw err;
        }
    });
};
var readFunctionFile = exports.readFunctionFile = function(path, header, footer, callback){
    fs.readFile(path, function(err, data){
        if(err){
            return callback(err, null);
        }
        try{
            var f = new Function(header+data+footer);
            callback(err, f);
        }catch(err){
            console.log("%s", path);
            throw err;
        }
    });
};

var scanDir = exports.scanDir = function(dir, proc, callback){
    fs.readdir(dir, function(err, files) {
        if(err){
            return callback(err);
        }
        async.forEach(files, function(file, next){
            proc(dir, file, function(err){
                next(err);
            });
        },function(err){
            callback(err);
        });
    });
};
