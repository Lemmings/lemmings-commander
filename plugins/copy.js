exports.initialize = function(){
};
exports.finalize = function(){
};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var async = new inputTools.SimpleAsync(function(){
        callback(null);
    });
    args.copy.forEach(function(v){
        async.inc();
        fs.readFile(v.from, function(err, data){
            fs.writeFile(v.to, data, function(err){
                async.dec();
            });
        });
    });
};
