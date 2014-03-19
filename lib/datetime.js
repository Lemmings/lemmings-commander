var digitPadding = function(str, digit, padstr){
    var w = '';
    if(str.length < digit ){
        var len = digit - str.length;
        for(var i = 0; i < len; ++i){
            w = padstr + w;
        }
    }
    return w + str;
};

var datePadding = function(str,digit){
    return digitPadding(str.toString(), digit, '0');
};

var format = exports.format = function(fmt,dateObj){
    if(dateObj instanceof Date){
        fmt = fmt.replace('y', datePadding(dateObj.getFullYear()-2000, 2));
        fmt = fmt.replace('Y', datePadding(dateObj.getFullYear(), 4));
        fmt = fmt.replace('m', datePadding(dateObj.getMonth()+1, 2));
        fmt = fmt.replace('d', datePadding(dateObj.getDate(), 2));
        fmt = fmt.replace('H', datePadding(dateObj.getHours(), 2));
        fmt = fmt.replace('i', datePadding(dateObj.getMinutes(), 2));
        fmt = fmt.replace('s', datePadding(dateObj.getSeconds(), 2));
        fmt = fmt.replace('M', datePadding(dateObj.getMilliseconds(), 3));
    }
    return fmt;
};
