exports.initialize = function(){};
exports.finalize = function(){};
exports.run = function(inputTools, callback){
    var args = inputTools.args();
    var async = new inputTools.SimpleAsync(function(){
        callback(null);
    });
    args.files.forEach(function(v){
        var fromfile = args.srcdir + '/' + v;
        var tofile = args.destdir + '/' + v;
        async.inc();
        fs.readFile(fromfile, function(err, data){
            if(err){
                console.error('readerror %s', fromfile);
                async.dec();
                return;
            }
            fs.writeFile(tofile, data, function(err){
                if(err){
                    console.error('writeerror %s', tofile);
                }
                async.dec();
            });
        });
    });
};
