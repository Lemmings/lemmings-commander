var fs = require('fs');
var FSM = require('event-fsm');
var events = require('events');
var util = require("util");
var crawler = require("./crawler");
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
var taskStrategy = function(self, task, v){
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
            var func = self.tacticsHandler.getFunc(task.tactics);
            var inputTools = {
                args : function(){
                   return task.args;
                },
                config : self.config,
                SimpleAsync : SimpleAsync,
                crawler : crawler,
                kvs : self.localkvs,
                timer : self.waittimer,
            };
            try{
                func(inputTools, function(err, res){
                    if(err){
                        console.error('tactics error %s:%s', task.tactics, err.stack);
                    }else{
                        self.localkvs[ task.tactics ] = res;
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

var Strategy = module.exports = function(tacticsHandler, name, data, config){
    events.EventEmitter.call(this);
    this.name = name;
    this.config = config;
    this.lists = data;
    this.isworking = false;
    this.localkvs = {};
    this.waittimer = 300;
    this.tacticsHandler = tacticsHandler;
    this.iserror = false;
    var self = this;

    var taskstate = [];
    taskInit(this, taskstate);
    this.lists.forEach(function(v){
        taskStrategy(self, taskstate, v);
    });
    taskFin(this, taskstate);

    this.fsm = new MyFSM(taskstate);
    this.fsm.on('changed', function(key, arg){
        console.log('changed:'+key);
    });
    this.fsm.restore(0);
};
util.inherits(Strategy, events.EventEmitter);

Strategy.prototype.run = function(){
    this.fsm.setState(1);
};

Strategy.prototype.getCurrentTask = function(){
    return this.lists[this.fsm.getState() - 1];
};

Strategy.prototype.heartbeat = function(){
    this.fsm.update();
};

