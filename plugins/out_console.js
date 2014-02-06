return {
    initialize : function(){
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        outputTools.console(inputTools.kvs[inputTools.args().input]);
        callback(null);
    },
}
