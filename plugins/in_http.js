return {
    initialize : function(){
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        inputTools.http_get(inputTools.args().url, function(res){
            callback(res);
        });
    },
}
