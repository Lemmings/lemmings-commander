exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    fs.writeFile(args.file, JSON.stringify(inputTools.kvs[args.input]), function(err){
        callback(err);
    });
};
