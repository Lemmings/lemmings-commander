var fs = require('fs');
var FSM = require('event-fsm');
var events = require('events');
var util = require("util");
var http_get = require("./http_get");

var state = function(){
    return new events.EventEmitter();
}

var MyFSM = function(tbl){
    this.length = tbl.length;
    FSM.call(this, tbl);
}
util.inherits(MyFSM, FSM);
MyFSM.prototype.next = function(){
    var n = parseInt(this.getState()) + 1;
    if(n >= this.length){
        n = 1;
    }
    this.setState(n);
}

var Agent = module.exports = function(pluginHandler, name, data){
    events.EventEmitter.call(this);
    this.name = name;
    this.lists = data;
    this.isworking = false;
    var self = this;
    var kvs = {};

    var taskstate = [state()];
    this.lists.forEach(function(v){
        taskstate.push(state()
        .on('begin', function(){
            console.log(self.getCurrentTask());
        })
        .on('update', function(){
            if(self.isworking){
                return;
            }
            self.isworking = true;
            var task = self.getCurrentTask();
            var func = pluginHandler.getFunc(task.agent);
            var inputTools = {
                args : function(){
                   return task.args;
                },
                http_get : http_get,
                kvs : kvs,
            };
            var outputTools = {
                console : console.log,
                file : fs.writeFile,
            };
            func(inputTools, outputTools, function(res){
                kvs[ task.agent ] = res;
                self.fsm.next();
            });
        })
        .on('end', function(){
            self.isworking = false;
        })
        );
    });

    this.fsm = new MyFSM(taskstate);
    this.fsm.on('changed', function(key, arg){
        console.log('changed:'+key);
    });
    this.fsm.restore(0);
    this.fsm.setState(1);
};
util.inherits(Agent, events.EventEmitter);

Agent.prototype.getCurrentTask = function(){
    return this.lists[this.fsm.getState() - 1];
};

Agent.prototype.heartbeat = function(){
    this.fsm.update();
};

