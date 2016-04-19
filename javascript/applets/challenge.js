//This is a rework of my old Khan Challenge game with better coding a smoother controls. 
//Input Variables
void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

var keys = [];
var inputFields = []; //Array to hold input fields
{
void keyPressed() //If a key is pressed it is set as true in the keys array
{
    keys[keyCode] = true;
    for(var ind in inputFields){
        inputFields[ind].typing();
    }
};
void keyReleased() //If a key is relaesed it is set as false in the keys array
{
    keys[keyCode] = false;
};
}
//Collision Function
var collision = function(pos1,pos2){
    if(pos1.x === pos2.x && pos1.y === pos2.y){return true;}
};
var collisionAll = function(pos, arr){
    for(var i = 0; i < arr.length; i++){
        for(var j = 0; j < arr[i].length; j++){
            if(collision(pos, arr[i][j].pos)){
                return true;
            }
        }
    }
    return false;
};
//Game Variables
var GRID = 20; //Grid size
var levelWalls = []; //Array to hold "Walls" in each level
var water = []; //Array to hold all "Water" in each level
var ice = []; //Array to hold all "Ice" in each level
var stones = []; //Array to hold all "Stones" in each level
var enemies = []; //Array to hold all "Enemies" in each level
var dirt = []; //Array to hold all "Dirt" in each level
var finish; //A still that represents the end of each level
var lvl = 0;
var credits = false;
var startscreen = true;
var char_Name = "Default";
var user_Name = "Default";


//Input Field for Name
void mouseClicked = function(){
    for(var ind in inputFields){
        inputFields[ind].click();
    }    
};

var Input_field = function(def, pos){
    this.active = false;
    this.submitted = false;
    this.input = def.split("");
    this.letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    this.shifting = false;
    this.pos = pos;
    this.length = 6;
    this.time = 0;
    this.blinkL = 30;
    this.view = false;
};
{
Input_field.prototype.getText = function(){
    // Perform some operation
    var input = this.input;
    input = input.join('');
    return input;
};
Input_field.prototype.printText = function(){
    textAlign(CORNER,CORNER);
    var input = this.input.join('');
    fill(0, 0, 0);
    if(this.time > this.blinkL || !this.active || this.submitted || input.length >= this.length){
        text(input, this.pos.x+3, this.pos.y+15);}
    else{
        text(input+"|", this.pos.x+3, this.pos.y+15);}
    if(this.time > 2*this.blinkL){this.time=0;}
    this.time++;
};
Input_field.prototype.findArr = function(arr, value){
    for (var element in arr){
        if (String.fromCharCode(value) === arr[element]){
            return element;
        }
    }
    return false;
};
Input_field.prototype.typing = function(){
    if(this.active){
        if (keyCode === 8){this.input.splice(this.input.length-1, 1);}
        if (keyCode === 10){this.submitted=true;keyCode = 0;}
        if (this.input.length <= this.length){
            if (this.findArr(this.letters, keyCode)!==false){
                if(keys[SHIFT]){this.input.push(String.fromCharCode(keyCode).toUpperCase());}
                else{this.input.push(String.fromCharCode(keyCode).toLowerCase());}
            }
        }
    }
};
Input_field.prototype.render = function(){
    if(this.view){
        if(!this.submitted){fill(255,255,255);}
        else {fill(135, 135, 135);}
        stroke(0,0,0);
        rect(this.pos.x, this.pos.y, this.length*10, 20);
        this.printText();
        if(!this.submitted){fill(105, 134, 250);}
        else{fill(74, 74, 74);}
        rect(this.pos.x, this.pos.y + 30, 50, 20);
        fill(255, 255, 255);
        textAlign(CORNER,CORNER);
        text("SUBMIT", this.pos.x + 3, this.pos.y+45);
    }
};
Input_field.prototype.click = function(){
    if(!this.submitted){
        if(mouseX > this.pos.x && 
           mouseX < this.pos.x+this.length*10 && 
           mouseY > this.pos.y && 
           mouseY < this.pos.y+20)
        {    this.active=true;}
        else if (mouseX > this.pos.x &&
            mouseX < this.pos.x+50 &&
            mouseY > this.pos.y + 30 &&
            mouseY < this.pos.y + 50 &&
            this.input.length >= 3){
                this.submitted = true;
            }
        else{this.active=false;}
    }
};
Input_field.prototype.deactive = function(){
    this.submitted = true;
    this.active = false;
    this.view = false;
};
}//Input_field Methods

//Title Screen Stuff
{
//Starting positions for shooting stars
var yPos = -20;
var xPos2 = 400 - 50;
var yPos2 = 20;
var xPos = -20;
var time = 0;
//Draws the title screen
var star = function(x, y){
    this.x=y;
    this.y=x;
    this.r=3;
};
star.prototype.draw = function(){
    this.r = random(3,5);
        noStroke();
    fill(252, 252, 252);
    if (floor(random(1,5000))===1)
    {
        ellipse(this.x, this.y, 10,10);
    }
    else
    {
        ellipse(this.x, this.y, this.r, this.r);
    }
};
var stars = [];
for (var i = 0; i < 50; i++){
    stars.push(new star(random(0, 300), random(0, 400)));
}
var titleBackground = function (){
    background(3, 9, 43);
            for (var i = 0; i < stars.length; i++)
            {
                stars[i].draw();
            }
            noStroke();
            fill(235, 252, 0);
            ellipse(xPos, yPos, 10, 10);
            ellipse(xPos2, yPos2, 10, 10);
            ellipse(xPos-3, yPos-2.5, 8, 8);
            ellipse(xPos2+3, yPos2-2.5, 8, 8);
            ellipse(xPos-6, yPos-5, 5, 5);
            ellipse(xPos2+6, yPos2-5, 5, 5);
            fill(255, 0, 0);
            ellipse(xPos, yPos, 6, 6);
            ellipse(xPos2, yPos2, 6, 6);
            xPos+=1.5;
            xPos2-=1.5;
            yPos+=1.0;
            yPos2+=1.5;
            if (xPos > 450 || yPos > 450)
            {
                xPos = random(-100, 200);
                yPos = random(-20, -40);
            }
            if (xPos2 < -50 || yPos2 > 450)
            {
                xPos2 = random(200, 500);
                yPos2 = random(-20, -40);
            }
            fill(0, 0, 0);
            rect(0,200, 80, 200);
            rect(80,240, 80, 160);
            rect(160, 100, 40, 300);
            rect(200, 275, 80, 150);
            rect(280, 200, 80, 200);
            rect(360, 250, 40, 150);
            fill(48, 43, 43);
            rect(400, 0, 100, 400);
};
var titleScreen = function(){
    titleBackground();
            pushMatrix();
            rotate(90);
                fill(255, 255, 255);
                textSize(45);
                text("Touch Screen", 55, -430);
                textSize(12);
                text("Press to Play!", 170, -410);
            popMatrix();
            fill(255, 255, 255);
            textSize(45);
            textAlign(CENTER,CENTER);
            if (time < 60*10){
                textAlign(CORNER,CORNER);
                text("Khan's Challenge", 35, 100);
                fill(255, 162, 0);
                text("REMASTERED", 45, 175);
                fill(255,255,255);
                text("Press Enter to Play", 5, 350);
            }
            else if (time < 60*15){
                text("Story:", 200, 100);
                textSize(12);
                text("Khan was your average joe until one day\nhe awoke to a falling star.", 200, 320);
            }
            else if (time < 60*25){
                textSize(12);
                text("After hearing the crash he left his apartment to find the star\nhad fallen in a nearby parking lot.", 200, 320);
            }
            else if (time < 60*35){
                textSize(12);
                text("However he was soon struck over the head...", 200, 320);
            }
            else if (time < 60*45){
                textSize(12);
                text("Khan awoke in a strange maze. Help him escape!", 200, 320);
            }
            else{
                time = 0;
            }
            if (keys[ENTER]){
                startscreen = false;
                inputFields[0].active=true;
                inputFields[0].view=true;
            }
            time++;
};}


//Objects that check if they can move in a direction, then move
var Mover = function(){
    this.pos = new PVector(0,0); //Upper left hand corner is the location
    this.posTarget = new PVector(0,0); //Location where you want to move
    this.size = new PVector(0,0); //Generally make this GRID
    this.vel = new PVector(0,0); //Horiz and Vert speed, make sure GRID is divisible by it
    this.img = getImage("avatars/questionmark"); //Image that will be displayed
    this.move = true; //Can the mover be moved
    this.dead = false; //Is the mover dead
    this.dir = 0; //Direction Character will moved UP - 1, LEFT - 2, DOWN - 3, RIGHT - 4, IDLE - 0
    this.lastDir = 0;
    this.walls = []; //An array of objects that will stop the mover from moving
    this.ice = []; //An array of objects that will keep the mover moving
    this.id=0;
};
{
Mover.prototype.setup = function(p, s, v, i) // Setup Position, Size, Velocity, Controls[Array], Image
{
        this.pos = p; //Position
        this.posTarget = p; //TargetPos
        this.size = s; //Size
        this.vel = v; //Velocity
        this.img = i; //Image
    };
Mover.prototype.getTarget = function() //Can be called to get object's target position
{
        return this.posTarget;
    };
Mover.prototype.getPos = function() //Can be called to get object's position
{
        return this.pos;
    };
Mover.prototype.getSize = function() //Can be called to get object's size
{
        return this.size;
    };
Mover.prototype.getDir = function() //Can be called to see what direction object is moving
{
        return this.dir;
    };
Mover.prototype.checkMovement = function(id) //Checks if there is an object either there or moving to it
{
    //println(this.walls.length);
        for (var i = 0; i < this.walls.length; i++)
        {
            for (var j = 0; j < this.walls[i].length; j++)
            {
                if(this.id===0 || this.walls[i][j].id!==this.id){
                    if (this.posTarget.x === this.walls[i][j].getPos().x && 
                        this.posTarget.y === this.walls[i][j].getPos().y)
                    {
                        return true;    
                    }
                    else if (this.posTarget.x === this.walls[i][j].getTarget().x && 
                             this.posTarget.y === this.walls[i][j].getTarget().y)
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    };
Mover.prototype.checkGrid = function() //Return true if on Grid
{
    if(this.pos.x%GRID===0&&this.pos.y%GRID===0){return true;}
    else{return false;}
};
Mover.prototype.addWalls = function(wall) //Adds the array walls to walls
{
        this.walls.push(wall);  
    };
Mover.prototype.removeWalls = function() //Removes all walls
{
        this.walls = [];
    };
Mover.prototype.render = function() //Renders character at pos with size and image.
{
        var pos = this.pos;
        var size = this.size;
        var img = this.img;
        var posTarget = this.posTarget;
        //rect(pos.x, pos.y, size.x, size.y); //Hit Box, Uncomment to See
        //rect(posTarget.x, posTarget.y, size.x, size.y); //Hit Box, Uncomment to See
        image(img, pos.x-(size.x/20)*5, pos.y-14*(size.y/20), 1.5*size.x, 2*size.y); //Display Img
        if(pos.x<0) //If you are leaving the screen on the left you will appear on the right
        {
            image(img, 400+pos.x-(size.x/20)*5, pos.y-14*(size.y/20), 1.5*size.x, 2*size.y);    
        }
        if(pos.x>400-size.x) //if you are leaving the screen on the right you will appear on the left
        {
            image(img, pos.x-400-(size.x/20)*5, pos.y-14*(size.y/20), 1.5*size.x, 2*size.y);
        }
        if(pos.y<0) //if you are leaving the screen on the top you will appear on the bottom
        {
            image(img, pos.x-(size.x/20)*5, 400+pos.y-14*(size.y/20), 1.5*size.x, 2*size.y);    
        }
        if(pos.y>400-size.y) //If you are leaving the screen on the left you will appear on the bottom
        {
            image(img, pos.x-(size.x/20)*5, pos.y-400-14*(size.y/20), 1.5*size.x, 2*size.y);
        }
    };
Mover.prototype.loopCoord = function(coord)
{
        if(coord.x >= 400)
        {
            coord.x = 0;
        }
        if(coord.x < 0)
        {
            coord.x = 400-GRID;
        }
        if(coord.y >= 400)
        {
            coord.y = 0;
        }
        if(coord.y < 0)
        {
            coord.y = 400-GRID;
        }
        return coord;
    };
Mover.prototype.setDir = function(dir) //Sets direction to input
{
        this.dir = dir;
    };
Mover.prototype.moving = function() //Moves player
{
    if(this.dir!==0){this.lastDir = this.dir;} //As long as you are not idle record dir
        if (this.dir !== 0) //If you are not idle
        {
            switch(this.dir)
            {
                case 1: //If you are moving up
                    this.pos.y-=this.vel.y; //Move up your vertical speed
                    break;
                case 2: //If you are moving left
                    this.pos.x-=this.vel.x; //Move left your horizontal speed
                    break;
                case 3: //If you are moving down
                    this.pos.y+=this.vel.y; //Move down your vertical speed
                    break;
                case 4: //If you are moving right
                    this.pos.x+=this.vel.x; //Move right your horizontal speed
                    break;
                default: //If dir is not any of those direction
                    this.dir = 0; //Set dir to idle
                    break;
            }
        }
        //This section keeps the player moving until they are in a grid square
        if(this.pos.x % GRID === 0 && this.pos.y % GRID === 0) //If you are in a grid square
        {
            if(this.move){this.dir = 0;} //Set movement to idle if you can move
            if(this.pos.x<0) //If you stop on the left side
            {this.pos.x=400-this.size.x;} //Teleport to the far right
            if(this.pos.x>=400) //If you stop on the right side
            {this.pos.x=0;} //Teleport to the far left side
            if(this.pos.y<0) //If you stop on the top side
            {this.pos.y=400-this.size.y;} //Teleport to the bottom side
            if(this.pos.y>=400) //If you stop on the bottom side
            {this.pos.y=0;} //Teleport to the top side
        }
    };
Mover.prototype.findTarget = function(direction) //Find the posTarget based on direction
{
    switch(direction) //direction 0-UP, 1-LEFT, 2-DOWN, 3-RIGHT
    {
        case 0: //If you are looking up set target to the grid above
            this.posTarget = new PVector(this.pos.x,this.pos.y-this.size.y);
            break;
        case 1: //If you are looking left set target to the grid to the left
            this.posTarget = new PVector(this.pos.x-this.size.x,this.pos.y);
            break;
        case 2: //If you are looking down set target to the grid below
            this.posTarget = new PVector(this.pos.x,this.pos.y+this.size.y);
            break;
        case 3: //If you are looking right set target to the grid to the right
            this.posTarget = new PVector(this.pos.x+this.size.x,this.pos.y);
            break;
        default: //If you pass neither of those options leave the function
            break;
    }
    this.posTarget = this.loopCoord(this.posTarget);//Check if position should be looped
};
}//Mover Methods

//Objects that do not move
var Still = function(pos, size, img){
    this.pos = pos; //Upper left hand corner is the location
    this.size = size; //Generally make this GRID
    this.img = img; //Image
    this.id = 0;
    this.dead = false;
    
};
{
    Still.prototype.render = function() //Renders character at pos with size and image.
    {
        image(this.img, this.pos.x, this.pos.y-9*(this.size.y/20), this.size.x, 1.5*this.size.y); //Display Img
        //text(this.pos.x,this.pos.x,this.pos.y+10);
        //text(this.pos.y,this.pos.x,this.pos.y+20);
        
        //rect(this.pos.x, this.pos.y, this.size.x, this.size.y); //Hit Box, Uncomment to See
    };
    Still.prototype.getTarget = function() //Can be called to get object's target position
    {
        return this.pos;
    };
    Still.prototype.getPos = function() //Can be called to get object's position
    {
        return this.pos;
    };
    Still.prototype.getSize = function() //Can be called to get object's size
    {
        return this.size;
    };
    Still.prototype.getDir = function() //Can be called to see what direction object is moving
    {
        return 0;
    };
}//Still Specific Methods

//Mover that is controlled by the keyboard
var Player = function(){
    this.pos = new PVector(0,0); //Upper left hand corner is the location
    this.posTarget = new PVector(0,0); //Location where you want to move
    this.size = new PVector(0,0); //Generally make this GRID
    this.vel = new PVector(0,0); //Horiz and Vert speed, make sure GRID is divisible by it
    this.img = getImage("avatars/questionmark"); //Image that will be displayed
    this.move = true; //Can the character be controlled
    this.dead = false; //Is the character dead
    this.dir = 0; //Direction Character will moved UP - 1, LEFT - 2, DOWN - 3, RIGHT - 4, IDLE - 0
    this.lastDir = 0;
    this.walls = []; //An array of objects that this will stop the player from moving
    this.ice = []; //An array of objects that will keep moving buddy
    this.pushed = []; //An array of objects that can be pushed
    this.enemies = []; //An array of objects that will kill the player
    this.con = [UP,LEFT,DOWN,RIGHT];
    this.id=0;
};
{
Player.prototype = Object.create(Mover.prototype);
Player.prototype.setup = function(p, s, v, c, i) // Setup Position, Size, Velocity, Controls[Array], Image
{
    this.pos = p; //Position
    this.posTarget = p; //TargetPos
    this.size = s; //Size
    this.vel = v; //Velocity
    this.con = c; //Controls[Array]
    this.img = i; //Image
    this.ice = [];
    this.pushed = [];
};
Player.prototype.input = function(){
    var onIce = false; //On ice
    var toWall = false; //Will move into wall
    var toStone = false; //Will move into stone
    var toEnemy = false; //Will move into enemy
    var moveForward = false; //Can move in last direction
    var input = -1; //Sets to no input direction
    
    if (this.checkGrid()){
        for(var i = 0; i < this.con.length; i++) //Go through each control button
        {
            if(keys[this.con[i]]) //If that button is being pressed
            {
                input = i; //Set input to that direction
            }
        }
        this.findTarget(this.lastDir-1); //Look at last direction you went
        if (!this.checkMovement()){moveForward=true;} //If you can move that way, then set moveFoward true
        this.findTarget(input); //Look at input
        if (collisionAll(this.pos,this.ice)){onIce=true;} //If you are on ice set onIce true
        if (collisionAll(this.posTarget,this.walls)){toWall=true;} //If you want to move to a wall set toWall true
        else if (collisionAll(this.posTarget,this.pushed)){toStone=true;} //If you want to move to a stone set toStone true
        else if (collisionAll(this.posTarget,this.enemies)){toEnemy=true;} //If you want to move to a enemy set toEnemy true
        if (!toWall){ //If you are not moving into a wall
            if(toStone && (input!==-1)){ //If you are moving into a wall with a direction
                for(var j = 0; j < this.pushed[0].length; j++){ //look through all the stones
                    if(collision(this.posTarget,this.pushed[0][j].pos)){ //If that is the stone
                        if(this.pushed[0][j].checkPush(input)) //Push that stone in the correct direction if possible
                        {
                            this.dir = input+1; //Set your movement to be that direction
                        }
                        else{
                            this.dir = 0; //If you cannot move stone set direction to ideal
                        }
                    }
                }
            }
            else if(onIce && !toStone && !this.checkMovement() && 
            !this.checkPush(this.lastDir-1) && moveForward) //Else if you are on ice with no stone and you can move the way you want, and you are not pushing anything in your last direction, and you can move foward
            {
                this.dir = this.lastDir; //Move foward
            }
            else
            {
                this.dir=input+1; //Move the way you want to move
            }
        }
        else{
            this.dir = 0; //If you are moving towards wall set to ideal
        }
        if(this.dir === 0){this.posTarget=this.pos;} //If you are ideal set target to your location
    }
};//Reads buttons pressed and adjusts character
Player.prototype.addIce = function(iceBlock){
    this.ice.push(iceBlock);
}; //Pushes array to ice array
Player.prototype.removeIce = function(){
    this.ice = [];
}; //Removes everything from ice array
Player.prototype.addPush = function(pushed){
    this.pushed.push(pushed);
}; //Pushes array to push array
Player.prototype.removePush = function(){
    this.pushed = [];
}; //Removes everything from push array
Player.prototype.addEnemies = function(enemies){
    this.enemies.push(enemies);
}; //Pushes enemies to enemy array
Player.prototype.removeEnemies = function(){
    this.enemies = [];
}; //Removes everything from enemy array
Player.prototype.checkPush = function(dir){
    var preTarget = this.posTarget; //Look at where you want to go
    this.findTarget(dir); //Set target to the direction you want to go
    if(collisionAll(this.posTarget,this.pushed)){ //If there is a collision between you and and a stone
        this.posTarget=preTarget; //return your target to your old target
        return true;} //return true
    else{ //else
        this.posTarget=preTarget; //return your target to your old target
        return false;} //return false
}; //Checks if a Push is in dir
Player.prototype.checkEnemies = function(){
    for(var i = 0; i < this.enemies.length; i++){ 
        for(var j = 0; j < this.enemies[i].length; j++){
            if(collision(this.pos,this.enemies[i][j].pos)){
                this.dead = true; //If you are on the same square as a enemy set dead to true
            }
        }
    }
}; //Checks if enemies are where you are
}//Player Specific Methods

//Movers that are moved when a player pushes them
var Push = function(pos, size, vel, img, id){
    this.pos = pos; //Upper left hand corner is the location
    this.posTarget = pos; //Location where you want to move
    this.size = size; //Generally make this GRID
    this.vel = vel; //Horiz and Vert speed, make sure GRID is divisible by it
    this.img = img; //Image that will be displayed
    this.move = true; //Can the character be controlled
    this.dead = false; //Is the character dead
    this.dir = 0; //Direction Character will moved UP - 1, LEFT - 2, DOWN - 3, RIGHT - 4, IDLE - 0
    this.dirLast = 0; //Last direction moved
    this.walls = []; //An array of objects that this will stop the player from moving
    this.water = []; //An array of objects that get deleted when touched
    this.ice = []; //An array of objects that will cause the pusher to move auto
    this.id = id; //An id used to make sure pushes do not register themselves for collision
};
{
    Push.prototype = Object.create(Mover.prototype);
    Push.prototype.checkPush = function(dir){
        this.findTarget(dir);
        if(this.checkMovement(this.id)){
            this.posTarget.x=this.pos.x;
            this.posTarget.y=this.pos.y;
            return false;
        }
        else{
            this.dir = dir+1;
            this.lastDir = this.dir;
            return true;
        }
    }; //Checks if a push in in the way
    Push.prototype.addIce = function(ice){
        this.ice.push(ice);
    }; //Pushes ice to ice array
    Push.prototype.checkIce = function(){
        this.findTarget(this.lastDir-1);
        if(this.checkMovement(this.id),collisionAll(this.pos,this.ice)){
            this.posTarget = this.pos;
            this.dir = this.lastDir;
        }
        this.posTarget = this.pos;
    }; //Checks if it is on ice and keeps moving if so
    Push.prototype.addWater = function(water){
        this.water.push(water);
    }; //Pushes water to water array
    Push.prototype.checkWater = function(){
        for(var j = 0; j < this.water.length; j++){
            for(var i = this.water[j].length-1; i >= 0; i--){
                if(collision(this.pos,this.water[j][i].pos)){
                    this.water[j].splice(i,1);
                    this.dead = true;
                }
            }
        }
    }; //Checks if it is on water and removes both
}//Push Specific Methods

//Movers with automatic movement controls
//Type 0: Moves in a random direction until it is stopped
//Type 2: Moves in a direction, when stopped will always turn left
//Type 1: Moves towards target
var Autos = function(pos, size, vel, img, type, target){
    this.pos = pos; //Upper left hand corner is the location
    this.posTarget = pos; //Location where you want to move
    this.size = size; //Generally make this GRID
    this.vel = vel; //Horiz and Vert speed, make sure GRID is divisible by it
    this.img = img; //Image that will be displayed
    this.move = true; //Can the character be controlled
    this.dead = false; //Is the character dead
    this.dir = 0; //Direction Character will moved UP - 1, LEFT - 2, DOWN - 3, RIGHT - 4, IDLE - 0
    this.walls = []; //An array of objects that this will stop the player from moving
    this.type = type;
    this.dirTarget = 0;
    this.id = 0;
    this.target = target;
    this.choice = 1;
};
{
Autos.prototype = Object.create(Mover.prototype);
Autos.prototype.checkMovementDir = function(dir){
    this.findTarget(dir);
    return !this.checkMovement();
};
Autos.prototype.auto = function(target) //How the enemy reacts automatically
{
    //Type 0: Chooses a random direction and keeps moving in it until it hits a wall
    if (this.type === 0) //If the enemy is of type 0
    {
        //If it is on a grid
        if (this.checkGrid()){
            this.findTarget(this.dirTarget); //Look at the direction you are going
            if(this.checkMovement()){ //IF you cannot move there
                this.dirTarget=floor(random(0,3.99)); //Choose a random direction
            }
            else{
                this.dir = this.dirTarget+1; //Else go that way
            }
        }
    }
    //Type 1: Looks where the player is and tries to move towards them
    if (this.type === 1){
        //If it is on a grid
        if(this.checkGrid()){
            if( this.choice === 1){ //If it is checking horizontally
                if (target.pos.x < this.pos.x){this.dirTarget = 1;} //If target left, target left
                else if (target.pos.x > this.pos.x){this.dirTarget = 3;} //Else target right
            }
            else{ //If checking vertically
                if (target.pos.y < this.pos.y){this.dirTarget = 0;} //If target up, target up
                else if (target.pos.y > this.pos.y){this.dirTarget = 2;} //Else target down
            }
            this.findTarget(this.dirTarget); //Set target to that direction
            if (!this.checkMovement()){ //If it can move in that direction
                this.dir = this.dirTarget+1; //Setup to move that direction
            }
            else{ //If it cannot move in that direction
                this.dirTarget = 0; //Forget the direction
                this.posTarget = new PVector(this.pos.x, this.pos.y); //Reset target
            }
            this.choice*=-1;//Switch which way to move
        }
    }
    if (this.type === 2){
        if(this.choice === 1){this.dirTarget=1;this.choice=0;} //Set start direction left
        if(this.checkGrid()){ //If it is on a grid
            switch(this.dirTarget){ //Look at the way it was moving
                case 0: //If moving up
                    if(this.checkMovementDir(3)){this.dirTarget=3;} //try to move right
                    else if(this.checkMovementDir(0)){this.dirTarget=0;} //try to move up
                    else if(this.checkMovementDir(1)){this.dirTarget=1;} //try to move left
                    else if(this.checkMovementDir(2)){this.dirTarget=2;} //try to move down
                    break;
                case 1: //If moving left
                    if(this.checkMovementDir(0)){this.dirTarget=0;} //try to move up
                    else if(this.checkMovementDir(1)){this.dirTarget=1;} //try to move left
                    else if(this.checkMovementDir(2)){this.dirTarget=2;} //try to move down
                    else if(this.checkMovementDir(3)){this.dirTarget=3;} //try to move right
                    break;
                case 2: //If moving down
                    if(this.checkMovementDir(1)){this.dirTarget=1;} //try to move left
                    else if(this.checkMovementDir(2)){this.dirTarget=2;} //try to move down
                    else if(this.checkMovementDir(3)){this.dirTarget=3;} //try to move right
                    else if(this.checkMovementDir(0)){this.dirTarget=0;} //try to move up
                    break;
                case 3: //If moving right
                    if(this.checkMovementDir(2)){this.dirTarget=2;} //try to move down
                    else if(this.checkMovementDir(3)){this.dirTarget=3;} //try to move right
                    else if(this.checkMovementDir(0)){this.dirTarget=0;} //try to move up
                    else if(this.checkMovementDir(1)){this.dirTarget=1;} //try to move left
                    break;
                default:
                    this.dirTarget=0; //Move left
                    break;
            }
            this.dir = this.dirTarget+1; //Move that direction
        }
    }
};
}//Autos Specific Methods

//Enviroment that displays a grid with specified color skeme
var Enviroment = function(bg,gc) 
{
    var bg = bg;  //background color
    var gc = gc;  //grid color
    
    this.render = function()
    {
        background(bg); //Fills background with bg color
        stroke(blendColor(gc, color(120,120,120), BLEND));
        strokeWeight(3);
        for (var i = 0; i < width/GRID; i++)//For every length grid of the width
        {
            line(i*GRID-1, 0, i*GRID-1, height);//Draw a vertical line down from top to bottom
        }
        for (var i = 0; i < height/GRID; i++)//For every length gride of the height
        {
            line(0, i*GRID-1, width, i*GRID-1);//Draw a horizontal line right from left to right
        }
        stroke(gc); //Sets stroke color to gc
        strokeWeight(1);
        for (var i = 0; i < width/GRID; i++)//For every length grid of the width
        {
            line(i*GRID, 0, i*GRID, height);//Draw a vertical line down from top to bottom
        }
        for (var i = 0; i < height/GRID; i++)//For every length gride of the height
        {
            line(0, i*GRID, width, i*GRID);//Draw a horizontal line right from left to right
        }
    };
};

//Initilize Objects
var player = new Player(); //Create an instance of the Player object called player
inputFields.push(new Input_field("Khan",new PVector(180,200)));
inputFields.push(new Input_field("",new PVector(180,200)));

//Game Functions
var Level = function(){
    this.layout = [
             ["BBBBBBBBBIBBBBBBBBBB",
              "B                  B",
              "B  BBB BB BB BBB   B",
              "B   B  B  B   B    B",
              "B   B  BB BB  B    B",
              "B   B  B   B  B    B",
              "B   B  BB BB  B    B",
              "B                  B",
              "B    S    S   BBBBBB",
              "       BBBBBBBB     ",
              "BBBBBBBBF        BBB",
              "BP     BBBBBBBBBBB B",
              "B                  B",
              "  BBB BBBIBBB BB BB ",
              "  B B B BIB B BWBWB ",
              "  BBB B BIBMB BWWWB ",
              "  BB  B BIB B B   B ",
              "  B B BBBIBBB B   B ",
              "B        I         B",
              "BBBBBBBBBIBBBBBBBBBB"], //Level 1
             ["IIIIIIIIIIII II IIII",
              "IIIIIIIIII IIIIIII I",
              "IIIIIIIIIIIIIIIIIIII",
              "WWWWWWWWWWWWWWWWWWWW",
              "IIIISIIIWIIIIIISIIII",
              "IIIIIIIIWIII IIIII I",
              "IIIIIIPIWI IIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIFIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII",
              "IIIIIIIIIIIIIIIIIIII"], //Level 2
             ["BBBBBBBBBBBBBBBBBBBB",
              "B                  B",
              "B                  B",
              "B                  B",
              "B                  B",
              "B                  B",
              "B                  B",
              "B     WWWWWW       B",
              "B     IIIIIW       B",
              "B     WWWWIW       B",
              "BB    WWF IW       B",
              "BPS   WWWWIW       B",
              "BB    IIIIIW       B",
              "B     WWWWWW       B ",
              "B                  B",
              "B                  B",
              "B                  B",
              "B                  B",
              "B                  B",
              "BBBBBBBBBBBBBBBBBBBB"], //Level 3
             ["BBBBBBBBBIBBBBBBBB B",
              "B                  B",
              "B  BBB BB BB BBB   B",
              "B   B  B  B   B    B",
              "B   B  BB BB  B    B",
              "B   B  B   B  B    B",
              "B   B  BB BB  B    B",
              "B                  B",
              "B             BBBBBB",
              "       BBBBBBBBWWW  ",
              "BBBBBBBBF       WBBB",
              "BP     BBBBBBBBBBBBB",
              "                  B ",
              "  BBB BBBIBBB BB BB ",
              "  B B B BIB B BWBWB ",
              "  BBB B BIB B BWWWB ",
              "S BB  B BIB B B   B ",
              "  B B BBBIBBBSB   B ",
              "B             S    B",
              "BBBBBBBBBIBBBBBBBB B"], //Level 4
             ["BBBBBBBBBBBBBBBBBBBB",
              "BIIIIIIIIIPIIIIIIIIB",
              "BIIIIIIIIIIIIIIIIIIB",
              "BWWWWWWWWW WWWWWWWIB",
              "BI II IIIIIIIIIIWWIB",
              "BIIIIIIIIIIIIIIIWWIB",
              "BIIIIIIIII III IWWIB",
              "IIIISIIIIW III IIWWI",
              "BIIIISIIIIWIIIIIWWIB",
              "BI I IIIII III IWWIB",
              "BWWWWWWWWWWWWWWWWWIB",
              "BWWWWWWWWWWWWWWWWWSB",
              " IIIIIISWIIIIIIIIIIB",
              "WIII IIIIIIIIIIIIIIB",
              "WIIIIII IIIIIIIIIIIB",
              "WIIIIIIISIIIIIIIII B",
              "WIII III IIIIIIIIIIB",
              "W IIWIIIIIIIIIIIIIIB",
              "BFWIIIIIIIIIIIIIIIIB",
              "BBBBBBBBBBBBBBBBBBBB"], //Level 5
             ["BBBBWW  WWWWWWWBBBBB",
              "BWWWW    W    WWWWWB",
              "B        W         B",
              "B        W         B",
              "B    BBBBBBBB      B",
              "B    BBBBBBBB   S  B",
              "B    BBBBBBBB      B",
              "B        B         B",
              "B     F  BBBBB     B",
              "B        B   B B   B",
              "BBBBBBBBBB B B BBBBB",
              "BPS        BSB B   B",
              "BBBBBBBB B B B B B B",
              "B IIII B   B B B BWB",
              "BS    IBBBBB B B B B",
              "BI I         B   B B",
              "BI I BBBBBBB BBBBB B",
              "BI I               B",
              " WWWWWWWWWWWWWBBBB  ",
              "BBBBWW      WWWBBBBB"], //Level 6
             ["BBBBBBBBBBBBBBBBBBBB",
              "B        BB  M     B",
              "B BB BBB BB BBB BB B",
              "B               A  B",
              "B BB B BBBBBB B BB B",
              "B    B   BB   B    B",
              "BBBB BBB BB BBB BBBB",
              "BBBB B        B BBBB",
              "   M   BB  BB       ",
              "BBBB B B    B B BBBB",
              "BBBB B B F  B B BBBB",
              "       BBBBBB       ",
              "BBBB B   P    B BBBB",
              "BBBB BBB BB BBB BBBB",
              "B  m B   BB   B    B",
              "B BB B BBBBBB B BB B",
              "B      A           B",
              "B BB BBB BB BBB BB B",
              "B        BB   M    B",
              "BBBBBBBBBBBBBBBBBBBB"], //Level 7
             ["BBBBBBBBBBBBBBBBBBdB",
              "B            WS  B B",
              "B  A     B    B  B B",
              "B    W BBB    B B  B",
              "B    W        B  B B",
              "B    W  W   BBBB B B",
              "B      BWBBBB  BmB B",
              "B      B     S B B B",
              "B  F   B BBBBB B B B",
              "B      B BIIIB B   B",
              "BBBBBBBBSBIIBB BBBBB",
              "BPSIIIIII II B SW  B",
              "BBBBBBBBBBIIBBMBBB B",
              "B        BIInB B   B ",
              "B    A   BBBBBBB BBB",
              "B                  B",
              "B        B   BB    B",
              "B       BB    B  BBB",
              "                 B  ",
              "BBBBBBBBBBBBBBBBBB B"], //Level 8
             ["BBBBBBBBBBBBBBBBBBBB",
              "B                  B",
              "B  F               B",
              "B                  B",
              "BddddddddddddddddddB",
              "WWWWWWWWWWWWWWWWWWWW",
              "WWWWWWWWWWWWWWWWWWWW",
              "WWWWWWWWWWWWWWWWWWWW",
              "WWWWWWWWWWWWWWWWWWWW",
              "BIIIIIIIIIIIIIIIIIIB",
              "B    BBB  BBB      B",
              "B                  B",
              "B    B  BBBB  S    B",
              "B    B       S S   B",
              "B        P   BSB   B",
              "B    B             B",
              "B A  B             B",
              "B       BBBB       B",
              "B                  B",
              "BBBBBBBBBBBBBBBBBBBB"], //Level 9
             ["BBBBBBBBBFBBBBBBBBBB",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "B       BPB        B",
              "B       B B        B",
              "B       B B        B",
              "B       B B        B",
              "BBBBBBBBBABBBBBBBBBB"], //Level 10
            ]; //Array of Level Arrays
    this.env = [new Enviroment(color(145, 145, 145),color(46, 46, 46)),
                new Enviroment(color(17, 184, 61),color(19, 87, 12))]; //Array of Different Enviroments
};
{
Level.prototype.load = function(i){
    var pushId = 1;
    for(var j = 0; j < this.layout[i].length; j++){
        for(var k = 0; k < this.layout[i][j].length; k++){
            switch(this.layout[i][j][k]){
                case 'P':
                    player.pos.x = k*20;
                    player.pos.y = j*20;
                    break;
                case 'B':
                    levelWalls.push(new Still(new PVector(k*20,j*20),new PVector(20,20), getImage("cute/WallBlock")));
                    break;
                case 'd':
                    dirt.push(new Still(new PVector(k*20, j*20), new PVector(20, 20), getImage("cute/DirtBlock")));
                    break;
                case 'I':
                    ice.push(new Still(new PVector(k*20,j*20), new PVector(20,20), getImage("cute/Star")));
                    break;
                case 'S':
                    stones.push(new Push(new PVector(k*20,j*20), new PVector(20,20), new PVector(2,2), getImage("cute/Rock"), pushId));
                    pushId++;
                    break;
                case 'M':
                    enemies.push(new Autos(new PVector(k*20,j*20), new PVector(GRID,GRID), new PVector(2,2), getImage("cute/EnemyBug"), 0));
                    break;
                case 'A':
                    enemies.push(new Autos(new PVector(k*20,j*20), new PVector(GRID,GRID), new PVector(1,1), getImage("avatars/robot_female_1"), 1, player));
                    break;
                case 'm':
                    enemies.push(new Autos(new PVector(k*20,j*20), new PVector(GRID,GRID), new PVector(2,2), getImage("avatars/purple-pi"), 2, player));
                    break;
                case 'n':
                    ice.push(new Still(new PVector(k*20,j*20), new PVector(20,20), getImage("cute/Star")));
                    enemies.push(new Autos(new PVector(k*20,j*20), new PVector(GRID,GRID), new PVector(2,2), getImage("avatars/purple-pi"), 2, player));
                    break;
                case 'W':
                    water.push(new Still(new PVector(k*20, j*20), new PVector(20,20), getImage("cute/WaterBlock")));
                    break;
                case 'F':
                    finish = new Still(new PVector(k*20,j*20), new PVector(20,20), getImage("cute/Selector"));
                    break;
                default:
                    break;
            }
        }
    }
    for(var i = 0; i < enemies.length; i++){
        enemies[i].addWalls(levelWalls);
        enemies[i].addWalls(stones);
        enemies[i].addWalls(water);
        enemies[i].addWalls(dirt);
    }
    for(var i = 0; i < stones.length; i++){
        stones[i].addWalls(levelWalls);
        stones[i].addWalls(enemies);
        stones[i].addWalls(stones);
        stones[i].addIce(ice);
        stones[i].addWater(water);
    }
    player.removeWalls();
    player.addWalls(levelWalls);
    player.removeIce();
    player.addIce(ice);
    player.removePush();
    player.addPush(stones);
    player.removeEnemies();
    player.addEnemies(water);
    player.addEnemies(enemies);
};
Level.prototype.unload = function(){
    levelWalls = []; //Array to hold "Walls" in each level emptied
    water = []; //Array to hold all "Water" in each level emptied
    ice = []; //Array to hold all "Ice" in each level emptied
    stones = []; //Array to hold all "Stones" in each level emptied
    enemies = []; //Array to hold all "Enemies" in each level emptied
    dirt = [];
};
}//Level Specific Methods

//Game Objects
var level = new Level();
player.setup(new PVector(20*15,12*20), new PVector(GRID,GRID), new PVector(2,2), [UP,LEFT,DOWN,RIGHT], getImage("cute/CharacterBoy")); //Setup the Player object


//Background and load level
var testCenter = new Enviroment(color(145, 145, 145),color(46, 46, 46)); //Gray room layout
level.load(0);

void draw() {
    if (startscreen){titleScreen();}
    else if(!inputFields[1].active && !inputFields[1].submitted){
        textAlign(CENTER,CENTER);
        titleBackground();
        fill(255,255,255);
        textSize(12);
        text("Oh, what is Khan's real name?", 200, 350);
        inputFields[0].render();
        if(inputFields[0].submitted){
            char_Name = inputFields[0].getText();
            inputFields[0].deactive();
            inputFields[1].active=true;
            inputFields[1].view=true;
            inputFields[1].active=true;
        }
    }
    else if(inputFields[1].active){
        textAlign(CENTER,CENTER);
        titleBackground();
        fill(255,255,255);
        textSize(12);
        text("Of course how I could I forget the name " + char_Name, 200, 350);
        text("But what is your name? Yes, you the player.", 200, 370);
        inputFields[1].render();
        if(inputFields[1].submitted){
            user_Name = inputFields[1].getText();
            inputFields[1].deactive();
        }
    }
    else if(!credits){
        player.input();
        for(var i = 0; i < enemies.length; i++){enemies[i].auto(player);}
        for(var i = 0; i < stones.length; i++){stones[i].checkIce();}
        player.moving();
        for(var i = 0; i < enemies.length; i++){enemies[i].moving();}
        for(var i = 0; i < stones.length; i++){stones[i].moving();}
        for(var i = stones.length-1; i >= 0; i--){
            stones[i].checkWater();
            if(stones[i].dead){stones.splice(i,1);}
        }
        testCenter.render();
        finish.render();
        for(var i = 0; i < dirt.length; i++){dirt[i].render();}
        for(var i = 0; i < levelWalls.length; i++){levelWalls[i].render();}
        for(var i = 0; i < ice.length; i++){ice[i].render();}
        for(var i = 0; i < water.length; i++){water[i].render();}
        for(var i = 0; i < stones.length; i++){stones[i].render();}
        player.render();
        for(var i = 0; i < enemies.length; i++){enemies[i].render();}
        if(player.pos.x === finish.pos.x && player.pos.y === finish.pos.y || keys[78]){
            if(lvl < level.layout.length - 1){
                keys[78]=false;
                level.unload();
                lvl++;
                level.load(lvl);
                time = 0;
            }
            else{credits = true;}
        }
        player.checkEnemies();
        if(player.dead || keys[82]){level.unload();level.load(lvl);player.dead=false;}
        fill(0, 255, 9);
    }
    else{
        stroke(0, 0, 0);
        background(16, 194, 0);
        fill(153, 144, 144);
        rect(0, 272, 128, 128);
        image(getImage("avatars/robot_male_3"), 0, 272);
        rect(0, 0, 400, 100);
        fill(3, 3, 3);
        rect(160,0, 80, 100);
        image(getImage("cute/CharacterBoy"), 150, 0);
        fill(252, 252, 252);
        rect(170, 270, 210, 110);
        rect(20,10,360,50);
        fill(240, 8, 19);
        textSize(30);
        text("Warning: \n Subject:" + char_Name + " \nhas escaped...", 180, 300);
        text("Look out for " + user_Name + "!", 50, 45);
        time++;
        if (time > 60*10){
            credits = false;
            startscreen = true;
            lvl = 0;
            level.unload();
            level.load(lvl);
            time = 0;
        }
    }
    //text(player.pos.x + "x" + player.pos.y, 20,20);
};

