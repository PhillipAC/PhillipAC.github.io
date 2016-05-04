//Camera Object
var Camera = function(x, y, board){
    this.x = x; //x coord
    this.y = y; //y coord
    this.xlast = 0;
    this.ylast = 0;
    this.speed = 2;
    this.board = board; //board to display
    this.locked = true;
};
{
Camera.prototype.renderBoard = function(){
    if(this.x < 200){this.x = 200;}
    else if(this.x > 600){this.x = 600;}
    if(this.y < 200){this.y = 200;}
    else if(this.y > 600){this.y = 600;}
    image(boardIMG,-this.x+200,-this.y+200,800,800)  
    this.renderPawns();
    if(this.xlast === this.x && this.ylast === this.y){
        this.locked = false;
    }
};
Camera.prototype.renderPawns = function(){
    for(var i = 0, length = this.board.pawns.length; 
        i < length; i++){
        var pawn = this.board.pawns[i];
        pawn.render(this.x,this.y);
    }
};
Camera.prototype.follow = function(obj){
    this.x = obj.x;
    this.y = obj.y;
};
Camera.prototype.slowfollow = function(obj){
    this.locked = true;
    var target = obj;
    this.xlast = this.x;
    this.ylast = this.y;
    if(target.x > this.x){this.x+=this.speed;}
    else if(target.x < this.x){this.x-=this.speed;}
    if(target.y > this.y){this.y+=this.speed;}
    else if(target.y < this.y){this.y-=this.speed;} 
};
}