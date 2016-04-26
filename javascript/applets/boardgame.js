//Importing Images for Game
/* @pjs preload="../images/boardgame.png""; */
PImage boardIMG = loadImage("../images/boardgame.png");
//Canvas Settup
void setup() { 
  size(400, 400); 
} 
var width = 400;
var height = 400;

//Game Code

//Spaces Object
var Space = function(index, type){
    this.index = index; //Index of space on board
    this.type = type; //String to hold type of space 
    this.pawns = []; //Pawns on the space
    
};

//Pawn Object
var Pawn = function(x, y, colors, spaces){
    this.location = 0; //Board Spaces Index for where you are
    this.spaces = spaces; //Spaces on the board
    this.color = colors; //Color of pawn
    this.moving = false; //Set true if player is moving
    this.x = x; //x coord
    this.y = y; //y coord
};
{
Pawn.prototype.render = function(camX,camY){
    fill(this.color);
    ellipse(200+this.x-camX,200+this.y-camY, 20, 20);
}
Pawn.prototype.forceMove = function(){
    if(keyPressed && keyCode === 38){this.y--;}
    if(keyPressed && keyCode === 40){this.y++;}
    if(keyPressed && keyCode === 37){this.x--;}
    if(keyPressed && keyCode === 39){this.x++;}
};
Pawn.prototype.moveSpace = function(){
    var target = this.spaces[this.location+1];
    if(target.x > this.x){this.x++;}
    else if(target.x < this.x){this.x--;}
    if(target.y > this.y){this.y++;}
    else if(target.y < this.y){this.y--;}
    if(this.x === target.x && this.y === target.y){
        this.moving = false;
    }
    else{
        this.moving = true;
    }
};
}

//Board Object
var Board = function(){
    this.spaces = []; //Array to hold spaces on board
    this.pawns = []; //Array to hold pawns on board
    this.image = boardIMG; //Board Background
};

//Camera Object
var Camera = function(x, y, board){
    this.x = x; //x coord
    this.y = y; //y coord
    this.board = board; //board to display
};
{
Camera.prototype.renderBoard = function(){
    if(this.x < 200){this.x = 200;}
    else if(this.x > 600){this.x = 600;}
    if(this.y < 200){this.y = 200;}
    else if(this.y > 600){this.y = 600;}
    image(boardIMG,-this.x+200,-this.y+200,800,800)  
    this.renderPawns();
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
};}

//Game Objects Intilized
var board = new Board();
board.pawns.push(new Pawn(200, 100, color(255, 0, 255)));
var camera = new Camera(200,0, board);

void draw(){
    board.pawns[0].forceMove();
    camera.follow(board.pawns[0]);
    camera.renderBoard();
    //println(board.pawns[0].x + " " + board.pawns[0].y);
};