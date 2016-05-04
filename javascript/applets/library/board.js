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
var Board = function(IMG, title, second_title){
    this.spaces = []; //Array to hold spaces on board
    this.pawns = []; //Array to hold pawns on board
    this.image = IMG; //Board Background
    this.turn = 0; //Index of pawn whose turn it is
    this.colors = [color(255,0,0), color(0,0,255), 
                   color(255,255,0), color(0,255,0)];
    this.mode = "START"; //Modes: START, SWITCH, ROLL, MOVE, CHECK, WIN
    this.x = 500; //Camera will target this location
    this.y = 400; //y-coordinate of camera targeting
    this.title = title;
    this.second_title = second_title;
};
{
Board.prototype.setupRender = function(){
    fill(0,255,0,100);
    rect(40,80,320, 70, 10);
    rect(40,200,60, 40, 10);
    rect(125,200,60, 40, 10);
    rect(215,200,60, 40, 10);
    rect(300,200,60, 40, 10);
    fill(255,255,255);
    text(this.title, 200, 100);
    text(this.second_title, 200, 130);
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