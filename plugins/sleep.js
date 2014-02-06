return {
    initialize : function(){
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        setTimeout(function(){
            callback(null);
        }, inputTools.args().timer * 1000);
    },
}
