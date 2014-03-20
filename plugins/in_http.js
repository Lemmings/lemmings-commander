exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var crawler = inputTools.crawler;
    crawler.request_get_raw(args.url, function(err, result){
        callback(err, result);
    });
};
