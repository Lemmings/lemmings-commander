var fs = require('fs');
var FSM = require('event-fsm');
var events = require('events');
var util = require("util");
var http_get = require("./http_get");
var https_get = require("./https_get");
var https_post = require("./https_post");
var SimpleAsync = require("./simple_async");

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

var taskInit = function(self ,task){
    task.push(state());
};
var taskFin = function(self, task){
    task.push(state()
        .on('begin', function(){
            console.log('wait');
        })
        .on('update', function(){
            if(self.isworking){
                return;
            }
            self.isworking = true;
            setTimeout(function(){
                self.fsm.next();
            }, self.waittimer * 1000);
        })
        .on('end', function(){
            self.isworking = false;
        })
    );
};
var taskAgent = function(self, task, v){
    task.push(state()
        .on('begin', function(){
            console.log(self.getCurrentTask());
        })
        .on('update', function(){
            if(self.isworking){
                return;
            }
            self.isworking = true;
            var task = self.getCurrentTask();
            var func = self.pluginHandler.getFunc(task.plugin);
            var inputTools = {
                args : function(){
                   return task.args;
                },
                SimpleAsync : SimpleAsync,
                http_get : http_get,
                https_get : https_get,
                https_post : https_post,
                kvs : self.localkvs,
                timer : self.waittimer,
            };
            try{
                func(inputTools, function(err, res){
                    if(err){
                    }else{
                        self.localkvs[ task.plugin ] = res;
                    }
                    self.waittimer = inputTools.timer;
                    self.fsm.next();
                });
            }catch(e){
                console.error(e.stack);
            }
        })
        .on('end', function(){
            self.isworking = false;
        })
    );
};

var Agent = module.exports = function(pluginHandler, name, data){
    events.EventEmitter.call(this);
    this.name = name;
    this.lists = data;
    this.isworking = false;
    this.localkvs = {};
    this.waittimer = 300;
    this.pluginHandler = pluginHandler;
    this.iserror = false;
    var self = this;

    var taskstate = [];
    taskInit(this, taskstate);
    this.lists.forEach(function(v){
        taskAgent(self, taskstate, v);
    });
    taskFin(this, taskstate);

    this.fsm = new MyFSM(taskstate);
    this.fsm.on('changed', function(key, arg){
        console.log('changed:'+key);
    });
    this.fsm.restore(0);
};
util.inherits(Agent, events.EventEmitter);

Agent.prototype.run = function(){
    this.fsm.setState(1);
};

Agent.prototype.getCurrentTask = function(){
    return this.lists[this.fsm.getState() - 1];
};

Agent.prototype.heartbeat = function(){
    this.fsm.update();
};

