var http = require('http');
var url = require('url');

var http_get = module.exports = function(urlstr, agent, callback){
    var opt = url.parse(urlstr);
    opt.agent = agent;
    var req = http.request(opt, function(res){
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('error', function(error){
            console.error(error.stack);
            callback(error, data);
        });
        res.on('end', function(){
            callback(null, data);
        });
    });
    req.on('error', function(error){
        console.error("%s:%s", urlstr, error.stack);
        callback(error, null);
    });
    req.end();
}
