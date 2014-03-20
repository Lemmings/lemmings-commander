exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var crawler = inputTools.crawler;
    var results = [];
    var async = new inputTools.SimpleAsync(function(){
        callback(null, results);
    });
    args.list.forEach(function(file){
        async.inc();
        crawler.readfile_json(file, function(err, result){
            if(err){
            }else{
                results.push(result);
            }
            async.dec();
        });
    });
};
