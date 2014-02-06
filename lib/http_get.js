var http = require('http');
var url = require('url');

var http_get = module.exports = function(urlstr, callback){
    var opt = url.parse(urlstr);
    var req = http.request(opt, function(res) {
        var data = '';
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            callback(data);
        });
    });
    req.end();
}
