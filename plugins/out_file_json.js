exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, outputTools, callback){
    var args = inputTools.args();
    outputTools.file(args.file, JSON.stringify(inputTools.kvs[args.input]), function(err){
        callback(null);
    });
};
