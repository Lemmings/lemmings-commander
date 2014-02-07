exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, outputTools, callback){
    inputTools.http_get(inputTools.args().url, function(err, res){
        callback(err, res);
    });
};
