var connect = require('connect');
var ConnectMain = require('./connect_main');

var REQUEST_TIMEOUT = 10000;

module.exports = function(config){
    return connect()
        .use(connect.timeout(REQUEST_TIMEOUT))
        .use(connect.favicon())
        .use(connect.query())
        .use(connect.logger('dev'))
        .use(ConnectMain.prepare())
        .use(ConnectMain.route(config))
    ;
}

