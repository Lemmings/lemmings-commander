exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    inputTools.crawler.exec_command_raw(args.command, function(err, result){
        callback(err, result);
    });
};
