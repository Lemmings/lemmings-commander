exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, outputTools, callback){
    outputTools.console(inputTools.kvs[inputTools.args().input]);
    callback(null);
};
