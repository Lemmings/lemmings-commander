var fs = require('fs');
var async = require('async');

var readJsonFile = exports.readJsonFile = function(path, callback){
    fs.readFile(path, function(err, data){
        if(err){
            return callback(err, null);
        }
        callback(err, JSON.parse(data));
    });
};
var readFunctionFile = exports.readFunctionFile = function(path, callback){
    fs.readFile(path, function(err, data){
        if(err){
            return callback(err, null);
        }
        callback(err, new Function(data));
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
