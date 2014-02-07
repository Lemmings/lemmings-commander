exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    console.log(inputTools.kvs[args.input]);
    callback(null);
};
