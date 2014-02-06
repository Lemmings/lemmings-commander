"use strict";
var events = require('events');
var util = require("util");
var Task = module.exports = function(interval, max){
    events.EventEmitter.call(this);

    this.lists = [];
    this.max = max || 1;
    this.interval = interval;
    this.loop = false;
};
util.inherits(Task, events.EventEmitter);

(function(proto, ext){ for(var key in ext) proto[key] = ext[key]; })
(Task.prototype, {
    start : function(){
        var update = function(self){
            if(self.loop){
                setTimeout(function(){
                    var count = exec(self.lists, self.max);
                    self.emit('report', count);
                    update(self);
                }, self.interval);
            }
        };
        this.loop = true;
        update(this);
    },
    stop : function(){
        this.loop = false;
    },
    add : function(func){
        if( func instanceof Function ){
            this.lists.push(func);
            return true;
        }
        return false;
    },
});

var exec = function(list, max){
    var w = list.splice(0, max);
    w.forEach(function(func){
        func();
    });
    return w.length;
};
