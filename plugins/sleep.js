exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, outputTools, callback){
    setTimeout(function(){
        callback(null);
    }, inputTools.args().timer * 1000);
};
