"use strict";

exports.prepare = function(){
    return function (req, res, next) {
        if (req.method === 'POST') {
            var data = new Buffer('');
            req.on('data', function(chunk) {
                data = Buffer.concat([data, chunk]);
            });
            req.on('end', function() {
                req.postraw = data;
                next();
            });
        } else {
            next();
        }
    };
};

exports.route = function(config){
    var send = function(res, code, result){
        res.statusCode = code;
        res.end(result);
    };
    var internal_server_error = function(res){
        send(res, 500, 'INTERNAL SERVER ERROR');
    };
    var not_found = function(res){
        send(res, 404, 'NOT FOUND');
    };
    var success = function(res, content){
        send(res, 200, content);
    };
    return function(req, res, next){
        switch(req.method){
        case 'POST':
/*
            var ctx = new Context(req.session, req.postraw);
            ctx.run(function(err, result){
                if(err){
                    ctx.emit('debug_on_fail', err);
                    internal_server_error(res);
                }else{
                    ctx.emit('debug_on_success', result);
                    success(res, result);
                }
            });
*/
            break;
        case 'GET':
            not_found(res);
            break;
        default:
            internal_server_error(res);
            break;
        }
    };
};
