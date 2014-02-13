var agent = null;
var http = null;
exports.initialize = function(){
    http = require('http');
    agent = new http.Agent({maxSockets: 1});
};
exports.finalize = function(){
};
exports.run = function(inputTools, callback){
    inputTools.http_get(inputTools.args().url, agent, function(err, res){
        callback(err, res);
    });
};
