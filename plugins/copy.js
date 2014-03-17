exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var async = new inputTools.SimpleAsync(function(){
        callback(null);
    });
    args.copy.forEach(function(v){
        async.inc();
        fs.readFile(v.from, function(err, data){
            if(err){
                console.error('readerror %s', v.from);
                async.dec();
                return;
            }
            fs.writeFile(v.to, data, function(err){
                if(err){
                    console.error('writeerror %s', v.to);
                }
                async.dec();
            });
        });
    });
};
