var require = null;
return {
    initialize : function(_require){
        require = _require;
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        outputTools.console(inputTools.kvs[inputTools.args().input]);
        callback(null);
    },
}
