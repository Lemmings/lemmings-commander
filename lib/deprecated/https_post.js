var https = require('https');
var url = require('url');

//クローラーなので気にしない
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var https_post = module.exports = function(urlstr, postdata, headers, callback){
    var opt = url.parse(urlstr);
    opt.method = 'POST';
    opt.headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    for(var key in headers){
        opt.headers[key] = headers[key];
    }
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
            callback(null, data);
        });
    });
    req.on('error', function(error){
        console.error("%s:%s", urlstr, error.stack);
        callback(error, null);
    });
    req.write(postdata);
    req.end();
}
