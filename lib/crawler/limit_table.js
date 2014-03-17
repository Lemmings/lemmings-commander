var createLimitter = require('request-limitter');

var LimitTable = module.exports = function(){
    this.tbl = {};
}
LimitTable.prototype.set = function(hostname, count, waittime){
    this.tbl[ hostname ] = {
        time : waittime,
        func : createLimitter(count, waittime),
    }
}
LimitTable.prototype.get = function(hostname){
    if(hostname in this.tbl){
        return this.tbl[hostname];
    }
    return { time : 0, func: function(){return true;}};
}
