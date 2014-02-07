var https = require('https');
var url = require('url');
/**
 * ToDo: add cert
 * */

var https_get = module.exports = function(urlstr, callback){
    var opt = url.parse(urlstr);
    var req = https.request(opt, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('error', function(error){
            console.error(error.stack);
            callback(error, data);
        });
        res.on('end', function(){
            callback(data);
        });
    });
    req.on('error', function(error){
        console.error("%s:%s", urlstr, error.stack);
        callback(error, null);
    });
    req.end();
}
