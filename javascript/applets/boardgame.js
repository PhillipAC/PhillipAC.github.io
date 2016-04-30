//Importing Images for Game
/* @pjs preload="../images/boardgame.png""; */
PImage boardIMG = loadImage("../images/boardgame.png");
//Canvas Settup
void setup() { 
  size(400, 400); 
} 
var width = 400;
var height = 400;
textAlign(CENTER,CENTER);
textSize(30);

//Game Code

//Spaces Object
var Space = function(index, type, x, y){
    this.index = index; //Index of space on board
    this.type = type; //String to hold type of space 
    this.x = x;
    this.y = y;
    this.pawns = []; //Pawns on the space
    
};

//Pawn Object
var Pawn = function(x, y, colors, spaces){
    this.location = -1; //Board Spaces Index for where you are
    this.spaces = spaces; //Spaces on the board
    this.color = colors; //Color of pawn
    this.moving = false; //Set true if player is moving
    this.onTile = false; //Set true if player is on a tile
    this.x = x; //x coord
    this.y = y; //y coord
    this.xAdj = 20;//Adjustment for where to move
    this.yAdj = 20;//Adjustment for where to move
    this.speed = 2;
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
Pawn.prototype.moveSpace = function(i){
    var target = this.spaces[this.location+i];
    if(target.x + this.xAdj > this.x){this.x+=this.speed;}
    else if(target.x + this.xAdj < this.x){this.x-=this.speed;}
    if(target.y + this.yAdj > this.y){this.y+=this.speed;}
    else if(target.y + this.yAdj < this.y){this.y-=this.speed;}
    if(this.x=== target.x +this.xAdj && this.y === target.y + this.yAdj){
        this.moving = false;
        this.location+=i;
        this.onTile = true;
    }
    else{
        this.moving = true;
        this.onTile = false;
    }
};
}

//Board Object
var Board = function(){
    this.spaces = []; //Array to hold spaces on board
    this.pawns = []; //Array to hold pawns on board
    this.image = boardIMG; //Board Background
    this.turn = 0; //Index of pawn whose turn it is
    this.colors = [color(255,0,0), color(0,0,255), 
                   color(255,255,0), color(0,255,0)];
    this.mode = "START"; //Modes: START, SWITCH, ROLL, MOVE, CHECK, WIN
    this.x = 500; //Camera will target this location
    this.y = 400; //y-coordinate of camera targeting
};
{
Board.prototype.setupRender = function(){
    fill(0,255,0,100);
    rect(40,80,320,40,10);
    rect(40,200,60, 40, 10);
    rect(125,200,60, 40, 10);
    rect(215,200,60, 40, 10);
    rect(300,200,60, 40, 10);
    fill(255,255,255);
    text("Bridges & Shortcuts", 200, 100);
    text("1",70,220);
    text("2",155,220);
    text("3",245,220);
    text("4",330,220);

    //Dynamic Title Screen
    this.x = 100*cos(PI*frameCount/(5*180))+400;
    this.y = -100*sin(PI*frameCount/(5*180))+400;
};
Board.prototype.setup = function(){
    var playerNum = 0;
    if(mouseY > 200 && mouseY < 240){
        if(mouseX > 40 && mouseX < 100){
            var playerNum = 1;
        }
        if(mouseX > 125 && mouseX < 185){
            var playerNum = 2;
        }
        if(mouseX > 215 && mouseX < 275){
            var playerNum = 3;
        }
        if(mouseX > 300 && mouseX < 360){
            var playerNum = 4;
        }
    }
    for(var i = 0; i < playerNum; i++){
        board.pawns.push(new Pawn(20, 620+30*i, this.colors[i], board.spaces));
    }
};
Board.prototype.nextTurn = function(){
    this.turn++;
    if(this.turn > this.pawns.length-1){
        this.turn = 0;
    }
};
}

//Secret Eastereggy Stuff
var secret = [];

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

//Dice Object
var Dice = function(){
    //Mode: NOT - Not being used, ignore any code
    //Mode: WAIT - Waiting to be rolled, wait for touch
    //Mode: ROLLING - Doing the rolling animation do not do anything
    //Mode: ROLLED - Show result of roll and wait for input.
    this.mode = "WAIT";
    this.roll = 0; //The result of a roll
    this.delay = 60;
    this.delayCount = 0;
};
{
Dice.prototype.update = function(){
    if(this.mode !== "NOT"){
        if(this.mode === "ROLLING"){
            this.roll = floor(random(1,6.99));
            this.delayCount++;
            if(this.delayCount >= this.delay){
                this.mode = "ROLLED";
            }
        }
        if(keyPressed && keyCode!==0){
            secret.push(keyCode);
            keyCode=0;
        }
        console.log(secret.toString(""));
        if(secret.toString("") === "38,38,40,40,37,39,37,39"){
            document.body.className+= " secret";        
        }
    }  
};
Dice.prototype.render = function(turn, color){
    if(this.mode!=="NOT"){
        if(this.mode === "WAIT"){
            fill(color);
            text("Player " + (turn + 1)+ " Roll!",200,200);
        }
        if(this.mode === "ROLLING" || this.mode === "ROLLED"){
            fill(255,255,255);
            rect(160,160,80,80,20);
            fill(0,0,0);
            text(this.roll, 200, 200);
        }
    }
}
}
//Game Objects Intilized
var dice = new Dice();
var board = new Board();
{
    board.spaces.push(new Space(0,"NONE",40,640)); //EndSlide1
    board.spaces.push(new Space(1,"NONE",80,640));
    board.spaces.push(new Space(2,"NONE",120,640));
    board.spaces.push(new Space(3,"NONE",160,640));
    board.spaces.push(new Space(4,"NONE",200,640));
    board.spaces.push(new Space(5,"NONE",240,640));
    board.spaces.push(new Space(6,"NONE",280,640));
    board.spaces.push(new Space(7,"NONE",280,600));
    board.spaces.push(new Space(8,"NONE",280,560));
    board.spaces.push(new Space(9,"NONE",280,520));
    board.spaces.push(new Space(10,"NONE",320,520));
    board.spaces.push(new Space(11,"SLIDE1",360,520)); //Slide1
    board.spaces.push(new Space(12,"NONE",400,520));
    board.spaces.push(new Space(13,"LADDER1",440,520)); //Ladder1
    board.spaces.push(new Space(14,"NONE",440,560));
    board.spaces.push(new Space(15,"NONE",440,600));
    board.spaces.push(new Space(16,"NONE",480,600));
    board.spaces.push(new Space(17,"NONE",520,600));
    board.spaces.push(new Space(18,"NONE",560,600));
    board.spaces.push(new Space(19,"NONE",600,600));
    board.spaces.push(new Space(20,"NONE",640,600));
    board.spaces.push(new Space(21,"NONE",640,560));
    board.spaces.push(new Space(22,"NONE",640,520));
    board.spaces.push(new Space(23,"NONE",640,480));
    board.spaces.push(new Space(24,"NONE",640,440));
    board.spaces.push(new Space(25,"NONE",640,400));
    board.spaces.push(new Space(26,"NONE",640,360));
    board.spaces.push(new Space(27,"NONE",600,360));
    board.spaces.push(new Space(28,"NONE",560,360));
    board.spaces.push(new Space(29,"NONE",520,360)); //EndLadder1
    board.spaces.push(new Space(30,"NONE",480,360));
    board.spaces.push(new Space(31,"SLIDE2",440,360)); //Slide2
    board.spaces.push(new Space(32,"NONE",400,360));
    board.spaces.push(new Space(33,"NONE",360,360));
    board.spaces.push(new Space(34,"NONE",320,360));
    board.spaces.push(new Space(35,"NONE",280,360));
    board.spaces.push(new Space(36,"NONE",240,360));
    board.spaces.push(new Space(37,"LADDER2",200,360)); //Ladder2
    board.spaces.push(new Space(38,"NONE",200,400));
    board.spaces.push(new Space(39,"NONE",200,440));
    board.spaces.push(new Space(40,"NONE",200,480));
    board.spaces.push(new Space(41,"NONE",160,480));
    board.spaces.push(new Space(42,"NONE",120,480));
    board.spaces.push(new Space(43,"NONE",80,480));
    board.spaces.push(new Space(44,"NONE",80,440));
    board.spaces.push(new Space(45,"NONE",80,400));
    board.spaces.push(new Space(46,"NONE",80,360));
    board.spaces.push(new Space(47,"NONE",80,320));
    board.spaces.push(new Space(48,"NONE",80,280));
    board.spaces.push(new Space(49,"NONE",80,240));
    board.spaces.push(new Space(50,"NONE",80,200));
    board.spaces.push(new Space(51,"NONE",120,200));
    board.spaces.push(new Space(52,"NONE",160,200));
    board.spaces.push(new Space(53,"NONE",200,200)); //EndLadder2
    board.spaces.push(new Space(54,"NONE",240,200));
    board.spaces.push(new Space(55,"NONE",280,200));
    board.spaces.push(new Space(56,"SLIDE3",320,200)); //Slide3
    board.spaces.push(new Space(57,"SLIDE4",360,200)); //Slide4
    board.spaces.push(new Space(58,"NONE",400,200));
    board.spaces.push(new Space(59,"NONE",440,200));
    board.spaces.push(new Space(60,"NONE",480,200));
    board.spaces.push(new Space(61,"NONE",520,200));
    board.spaces.push(new Space(62,"NONE",560,200));
    board.spaces.push(new Space(63,"NONE",600,200));
    board.spaces.push(new Space(64,"NONE",640,200));
    board.spaces.push(new Space(65,"NONE",640,160));
    board.spaces.push(new Space(66,"NONE",640,120));
    board.spaces.push(new Space(67,"NONE",640,80));
    board.spaces.push(new Space(68,"NONE",640,40));
    board.spaces.push(new Space(69,"NONE",640,20));
    board.spaces.push(new Space(69,"NONE",640,0));
    
}
//board.pawns.push(new Pawn(100, 700, color(255, 0, 255), board.spaces)); //
var camera = new Camera(500,400, board);

void mousePressed(){
    
    if (board.mode === "START"){
        board.setup();
    }
    else if (board.mode === "ROLL"){
        if(dice.mode === "WAIT"){
            dice.mode = "ROLLING";
            dice.delayCount = 0;
        }  
        else if(dice.mode === "ROLLED"){
            dice.mode = "NOT";
        }
        
    }
    else if (board.mode === "CHECK" || 
             board.mode === "SWITCH" || 
             board.mode === "MOVE"){
                 console.log(board.mode);
             }
    else{
        board.pawns = [];
        board.turn = 0;
        board.mode = "START";
        dice.mode = "WAIT";
        dice.roll = 0;
        dice.delayCount = 0;
    }
    
};

void draw(){
    camera.renderBoard();
    if(board.mode === "START"){
        camera.follow(board);
        board.setupRender();
        if(board.pawns.length > 0){
            board.mode = "SWITCH"
            camera.locked = true;
        }
    }
    else if (board.mode === "SWITCH"){
        if(camera.locked){
            camera.slowfollow(board.pawns[board.turn]);    
        }
        else{
            board.mode = "ROLL";
            dice.mode = "WAIT";
        }
    }
    else if (board.mode === "ROLL"){
        //Pause for mousePressed function
        camera.follow(board.pawns[board.turn]);
        dice.update();
        dice.render(board.turn, board.colors[board.turn]);
        if(dice.mode==="NOT"){
            board.mode = "MOVE";    
        }
    }
    else if(board.mode==="MOVE"){
        camera.follow(board.pawns[board.turn]);
        if(dice.roll>0){
            board.pawns[board.turn].moveSpace(1);
        }
        if(board.pawns[board.turn].onTile){
            dice.roll--;
        }
        if(dice.roll <= 0){
           board.mode="CHECK";
        }
        if(board.pawns[board.turn].location === 69){
            board.mode = board.turn;
        }
    }
    else if(board.mode==="CHECK"){
        var type = board.spaces[board.pawns[board.turn].location].type;
        console.log(type);
        if(type==="NONE")
        {
            board.nextTurn();
            board.mode = "SWITCH";
            camera.locked = true;
        }
        else if(type==="SLIDE1"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-11);
        }
        else if(type==="SLIDE2"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-19);
        }
        else if(type==="SLIDE3"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-24);
        }
        else if(type==="SLIDE4"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-25);
        }
        else if(type==="LADDER1"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(16);
        }
        else if(type==="LADDER2"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(16);
        }
    }
    else{
        fill(board.colors[board.mode]);
        text("Player " + (board.mode+1) + " Wins!",200,200);
    }
    //println(board.pawns[0].x + " " + board.pawns[0].y);
};

//Notes
/*
Turn Cycle                   Board Modes
    Dice Roll              - Mode ROLL
    Character Move         - Mode MOVE
    Check Space            - Mode Check
        Do action
    Switch to next player  - Mode SWITCH

Sudo Code for Turn Cycle
    If mode SWITCH
        Move camera to player
        If camera is on player switch mode to ROLL
    If mode ROLL
        Dice.update 
        if Dice.Mode NOT
            switch to MOVE
    if mode MOVE
            Move player along the spots 
            If player has completed moves
                switch Dice.Mode to WAIT
                switch mode to CHECK
    If mode CHECK
        check type of spot
            Do what spot says
            If action complete
                switch player
                switch mode to SWITCH
                
        
        





*/