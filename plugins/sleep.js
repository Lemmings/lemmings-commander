var require = null;
return {
    initialize : function(_require){
        require = _require;
    },
    finalize : function(){
    },
    run : function(inputTools, outputTools, callback){
        setTimeout(function(){
            callback(null);
        }, inputTools.args().timer * 1000);
    },
}
