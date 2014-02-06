var require = null;
return {
    initialize : function(_require){
        require = _require;
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        inputTools.http_get(inputTools.args().url, function(res){
            callback(res);
        });
    },
}
