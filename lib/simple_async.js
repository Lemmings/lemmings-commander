var SimpleAsync = module.exports = function(completeCB){
    this.completeCB = completeCB;
    this.count = 0;
}
SimpleAsync.prototype.inc = function(){
    ++this.count;
}
SimpleAsync.prototype.dec = function(){
    --this.count;
    if(this.count === 0){
        this.completeCB();
    }
}
