void setup() { 
  size(400, 400); 
} 

var width = 400;
var height =400;

//Wrestling, Player 1 LEFT: A, RIGHT: D, HOLD/ESCAPE: W, DUCK: S
//           Player 2 LEFT: LEFT, RIGHT, RIGHT, HOLD/ESCAPE: UP, DUCK: DOWN
//This is a game I made one day to interact with a makeymakey. The core 
//gameplay is very simple leading to a very easy learning curve.

//dangleMode="radians"; //Setting the angles to use radians
textSize(40); //Default textsize is 40
textAlign(CENTER,CENTER); //Default text alignment is in the center
var players = []; //Array that holds the two players
var fighting = 0; //Who has last clicked their "Hold/Escape" button

var keys = []; //Array that holds which buttons are currently pressed
void keyPressed(){
    keys[keyCode]=true; //Sets the button pressed to true
    //This section sets who was the last one to press their hold/escape button
    if(players[0].con[0]===keyCode){
        players[0].fight=true;
        players[1].fight=false;}
    if(players[1].con[0]===keyCode){
        players[0].fight=false;
        players[1].fight=true;}
};
void keyReleased(){
    keys[keyCode]=false; //Sets the button released to false
};

//This objects holds the logical and visuals for the chair
var Chair = function(dir){
    //Depending on what side the chair is on 0 - LEFT 1 - RIGHT
    if(dir === 0){this.x = 0;}
        else{this.x = 380;}
    this.y = 310;
    this.angle = 0; //How much the chair is rotated visually
    this.dir = dir; //Which way the chair is going
    this.mode = 0; //0 - Nothing, 1 - Waiting, 2 - throwing
    this.vel = 4; //How fast the chair is thrown
};
Chair.prototype.render = function(){
    //If the mode is not 0 display the chair
    if(this.mode !== 0){
        pushMatrix();
            translate(this.x,this.y);
            rotate(this.angle);
            fill(100,100,100);
            rect(0,0,20,20,3);
            noFill();
            stroke(100,100,100);
            rect(0,-10,20,10);
            stroke(0,0,0);
        popMatrix();
    }
};
Chair.prototype.throwing = function(){
    //If the mode is 2 have the chair move across the arena
    if(this.mode === 2){
        if(this.dir === 0){
            this.x+=this.vel;
            this.angle+=0.01;
        }
        else{
            this.x-=this.vel;
            this.angle-=0.01;
        }
        //If the chair is off the screen reset the chair
        if(this.x < -30 || this.x > 430){
            this.mode = 0;
            this.angle = 0;
            if(this.dir === 0){this.x = 0;}
            else{this.x = 380;}
        }
    }
};

var Player = function(x,y,w,h,con,col,dir){
    this.pos = new PVector(x,y); //The location of the player
    this.size = new PVector(w,h); //The size of the player
    this.con = con; //The controls for the player
    this.col = col; //The shirt color of the player
    this.dir = dir; //The side the player is on 0 - LEFT, 1 - RIGHT
    this.vel = 2; //The speed of the player
    this.staminaMax = 100; //The max energy
    this.stamina = this.staminaMax; //The current energy
    this.enemy = null; //Who is considered the enemy
    this.state = 0; //0 - stand, 1 - walk, 2 - attempt, 3 - grabbed, 4 - grabbing, 
    this.free = 0; //A counter that must be maxed to escape
    this.pinned = false; //Are you fully pinned? True and you lose
    this.fight = false; //Are you wrestling?
    this.timer = 0; //A timer that increases when reaching. Once 100 a chair appears
    this.chair = new Chair(dir); //The chair
};
Player.prototype.input = function() {
    //So long as you are not pinning or escaping
    if((this.state !== 3) && (this.state !== 4)){
        //Set yourself to a default state
        this.state = 0;
        //If you press left move left as long as you can
        if(keys[this.con[1]] && 
            (this.dir === 0 || 
            (this.pos.x > this.enemy.pos.x+
                          this.enemy.size.x)) && this.pos.x > 0){
            this.pos.x-=this.vel;
            this.state = 1;
        }
        //If you press right move right as long as you can
        if(keys[this.con[3]] &&
            (this.dir === 1 ||
            (this.pos.x + this.size.x < this.enemy.pos.x)) && this.pos.x+this.size.x<400){
            this.pos.x+=this.vel;
            this.state = 1;
        }
        //If you attempt a reach
        if(keys[this.con[0]]){
            this.state = 2; //Set state to attemping
            this.stamina -= 0.1; //Decrease stamina
            this.timer++; //Increase chair timer
            //If the enemy is in reach set your state to pinning and his to pinned
            //So long as the enemy is not trying to also reach
            if(this.enemy.state !== 2 && this.checkHands()){
                this.state = 4;
                this.enemy.state = 3;
            }
        }
        //If you are pressing down and not trying to reach
        if(keys[this.con[2]] && !keys[this.con[0]]){
            //heal a little
            if(this.stamina < this.staminaMax){
            this.stamina += 0.1;}
        }
    }
    //If you are pinned or pinning and pressing the attach button
    else if (this.fight && keys[this.con[0]]){
        //If you are pinning decrease enemy's stamina
        if (this.state === 4){
            this.enemy.stamina -= 1;
        }
        //If you are pinned increase free, once free reset
        else if (this.state === 3){
            this.free += 1;
            if (this.free > 25){
                this.free = 0;
                this.state = 0;
                this.enemy.state = 0;
                if (this.dir === 0){
                    this.pos.x -= 50;
                }
                else {this.pos.x += 50;}
            }
        }
        keys[this.con[0]]=false;
    }
    //If you have less than 0 stamina you lose
    if(this.stamina < 0){
        this.pinned =true;
    }
    //If the timer reaches 100 spawn a chair
    if(this.timer===100){this.chair.mode = 1;}
    //If a chair is spawned and you are near it throw the chair
    if(this.chair.mode === 1 && abs(this.pos.x - this.chair.x) <= this.size.x ){
        this.chair.mode = 2;
        this.timer = 0;
    }
    //Chair throwing logic
    this.chair.throwing();
    //If a chair is being thrown at you check if you are ducking
    //If you are not lose 40 stamina when it hits you.
    if(this.enemy.chair.mode===2 && 
       this.enemy.chair.x===this.pos.x+this.size.x/2 &&
       (this.state !== 3) && (this.state !== 4)){
        if(!keys[this.con[2]]){
            this.stamina-=40;
            if(this.stamina<0){this.stamina=0;}
        }
    }
};
Player.prototype.checkHands = function(){
    //Checks if the enemy is inside your hand length
    if(this.dir === 0){
        if(this.enemy.pos.x > this.pos.x+this.size.x/2 &&
           this.enemy.pos.x < this.pos.x+this.size.x/2 + this.size.x){
               background(255, 0, 0);
               return true;
           }
    }
    else{
        if(this.enemy.pos.x+this.enemy.size.x > this.pos.x-this.size.x/2 &&
           this.enemy.pos.x+this.enemy.size.x < this.pos.x){
               background(0,0,255);
               return true;
           }
    }
    return false;
};
Player.prototype.render = function(){
    var pos = this.pos;
    var size = this.size;
    fill(255,255,255);
    //This draws the health bar in the correct location 
    //This could be simplified by giving some more variables based
    //on dir
    if(this.dir === 0){
        rect(20, 20, 150, 20, 5);
        fill(this.col);
        rect(20, 20, 150*(this.stamina/this.staminaMax), 20, 5);
    }
    else{
        rect(200+20, 20, 150, 20, 5);
        fill(this.col);
        rect(220+150*(1-this.stamina/this.staminaMax), 20, 150*(this.stamina/this.staminaMax), 20, 5);
    }
    //Visuals for the wrestler
    pushMatrix();
    translate(pos.x,pos.y);
    //If you are on the right this will reflect your visuals to face left
    if(this.dir === 1){
        scale(-1,1);
        translate(-size.x,0);}
    //Pinned Visuals
    if(this.state===3){
        pushMatrix();
            translate(this.size.x,this.size.y/2);
            rotate(PI/2);
            fill(this.col);
            rect(size.x/4, size.y*1/4, size.x/2, 3/4*size.y, 10);
            fill(242, 245, 142);
            ellipse(size.x/2, size.y*1/4, size.x, 1/2*size.y);
        popMatrix();
    }
    //Pinning Visuals
    else if(this.state===4){
        pushMatrix();
            translate(this.size.x,0);
            rotate(PI/4);
            fill(242, 245, 142);
                rect(size.x/2,size.y/2,size.x,size.y*1/10,5);
            fill(this.col);
            rect(size.x/4, size.y*1/4, size.x/2, 3/4*size.y, 10);
            fill(242, 245, 142);
            ellipse(size.x/2, size.y*1/4, size.x, 1/2*size.y);
        popMatrix();
    }
    //Player Visuals when standing
    else if(!keys[this.con[2]] || keys[this.con[0]]){
        //So long as you are not pinning or pinned show the arms
        if(keys[this.con[0]] || !((this.state !== 3) && (this.state !== 4))){
            fill(242, 245, 142);
            rect(size.x/2,size.y/2,size.x,size.y*1/10,5);
        }
        fill(this.col);
        rect(size.x/4, size.y*1/4, size.x/2, 3/4*size.y, 10);
        fill(242, 245, 142);
        ellipse(size.x/2, size.y*1/4, size.x, 1/2*size.y);
    }
    //Player visuals when ducking
    else{
        //This should not happen but reaching visuals while ducking
        if(keys[this.con[0]] || !((this.state !== 3) && (this.state !== 4))){
            fill(242, 245, 142);
            rect(size.x/2, size.y*3/4, size.x, size.y*1/10,5);
        }
        fill(this.col);
        rect(size.x*1/4, size.y*1/2, size.x/2, 1/2*size.y, 10);
        fill(242, 245, 142);
        ellipse(size.x/2, size.y*1/2, size.x, 1/2*size.y);
    }
    popMatrix();
    this.chair.render();
};

//Function to draw the game background
var bg = function(){
    background(0,0,0);
    //The lights
    fill(255, 255, 0);
    for(var i = 0; i < 400; i+=58){
        ellipse(25+i,100, 50, 50);
    }
    //The arena
    fill(128, 128, 128);
    rect(0, 350, 400, 50);
};

//Setting up the players
players.push(new Player(60,300,40,80,[87, 65, 83, 68], color(255, 0, 0), 0));
players.push(new Player(300,300,40,80,[UP,LEFT,DOWN,RIGHT], color(0,0,255), 1));

//Assigning enemies to players
players[1].enemy = players[0];
players[0].enemy = players[1];


void draw() {
    bg();
    //Displays a message if someone has one
    if(players[0].pinned){
        fill(0,0,255);
        text("BLUE WINS!", 200, 200);
    }
    else if(players[1].pinned){
        fill(255, 0, 0);
        text("RED WINS!", 200, 200);
    }
    //If noone has one it will check for inputs
    else{
    for(var i = 0; i < players.length; i++){
        players[i].input();}}
    //Display both players
    for(var i = 0; i < players.length; i++){
        players[i].render();}
};
