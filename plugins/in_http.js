exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    inputTools.crawler.request_get_raw(inputTools.args().url, function(err, res){
        callback(err, res);
    });
};
