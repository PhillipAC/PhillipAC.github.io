//Khan's Revenge 1.1
//By: Phillip Clontz
//A classic side scrolling shooter
//Objective: Defeat the space dragon
//Game will continue until you die.
//Click screen to reset after death
//Story: After escaping from the woods Khan found a space ship
//       Help Khan get revenge against the robots and their space dragon.

/* @pjs preload="../images/Piceratops-ultimate.png"; */
/* @pjs preload="../images/Rock.png"; */
/* @pjs preload="../images/Heart.png"; */
/* @pjs preload="../images/Robot_female_1.png"; */
/* @pjs preload="../images/rocketship.png"; */
PImage dragonImg = loadImage("../images/Piceratops-ultimate.png");
PImage rockImg = loadImage("../images/Rock.png");
PImage heartImg = loadImage("../images/Heart.png");
PImage robotImg = loadImage("../images/Robot_female_1.png");
PImage shipImg = loadImage("../images/rocketship.png");

void setup() { 
  size(400, 400); 
} 

var width = 400;
var height =400;

var keys = [];
var pause = 0;
void keyPressed(){keys[keyCode]=true;};
void keyReleased(){keys[keyCode]=false;};

var collision = function(obj1, obj2){
    if( obj1.position.x < (obj2.position.x + obj2.size.x) && 
        (obj1.position.x + obj1.size.x) > obj2.position.x &&
        obj1.position.y < (obj2.position.y + obj2.size.y) && 
        (obj1.position.y + obj1.size.y) > obj2.position.y){
        return true;
    }
};
var Attack = function(position, size, velocity, color){
    this.position = position;
    this.size = size;
    this.velocity = velocity;
    this.color = color;
    this.alive = true;
    
    //Kills Object
    this.kill = function(){
        this.alive = false;
    };
    //Contains visuals
    this.display = function(){
        noStroke();
        fill(this.color);
        ellipse(this.position.x, this.position.y, this.size.x, this.size.y);
    };
    //Contains movement
    this.update = function(){
        this.position.add(this.velocity);
        if(this.position.x < -100 || this.position.x > 500){
            this.kill();
        }
        this.display();
    };
    this.checkLife = function(){
        return this.alive;
    };
}; 
//0:Moves 1:Moves, Bounces, Attacks 2:Tracks, Attacks
var Entity = function(position, size, picture, velocity, maxHealth, version, color, aVelocity, bm){
    this.position = position;
    this.size = size;
    this.picture = picture;
    this.velocity = velocity;
    this.aVelocity = aVelocity;
    this.version = version;
    this.color = color;
    this.maxHealth = maxHealth;
    this.health = this.maxHealth;
    this.attacks = [];
    this.wait = 10;
    this.time = 31;
    this.alive = true;
    this.barmoved = bm;
    
    //Contains visuals
    this.display = function(){
        //rect(this.position.x, this.position.y, this.size.x, this.size.y);
        image(this.picture, this.position.x, this.position.y-0.80*this.size.y, this.size.x, 2*this.size.y); 
    };
    //Contains information for updating non-player objects
    this.updateAuto = function(target){
        for(var i = (this.attackNumber()-1); i >= 0; i--){
            this.attacks[i].update();
            if(!this.attacks[i].checkLife()){
                this.attacks.splice(i,1);
            }
        }
        if(this.version===0){this.position.add(this.velocity);}
        if(this.version===1){
            this.position.add(this.velocity);
            if(this.position.y<0 || this.position.y > 400){this.velocity.mult(-1);}
            if(this.time > this.wait*5){
                this.attack();
                this.time = 0;
            }
            this.time++;
            this.showHealth();
        }
        if(this.version===2){
            if(this.position.x < 300){
                this.position.x++;
                this.position.y--;
                this.health = this.maxHealth;
            }
            else{
                if(target.position.y < this.position.y){this.position.y-=4;}
                if(target.position.y > this.position.y){this.position.y+=4;}
                if(this.time > this.wait){
                    this.attack();
                    this.time = 0;
                }
                this.time++;
                this.showHealth();
                if(target.health<=0){this.version=0;}
            }
        }
        this.display();
    };
    //Contains information for updating player objects
    this.update = function(){
        for(var i = (this.attackNumber()-1); i >= 0; i--){
            this.attacks[i].update();
            if(!this.attacks[i].checkLife()){
                this.attacks.splice(i,1);
            }
        }
        if(this.position.x < 0){this.position.x++;}
        if(keys[UP] && (this.position.y > 0)){this.position.sub(this.velocity);}
        if(keys[LEFT] && (this.position.x > 0)){this.position.x-=this.velocity.y;}
        if(keys[RIGHT] && (this.position.x < width/2)){this.position.x+=this.velocity.y;}
        if(keys[DOWN] && (this.position.y+this.size.y < 400)){this.position.add(this.velocity);}
        if(keys[32] && (this.time > this.wait)){
            this.attack();
            this.time = 0;
        }
        this.display();
        this.showHealth();
        this.time++;
        //println(this.position);
    };
    //Contains information for attacking
    this.attack = function(){
        var pos = new PVector(0,0,0);
        pos.add(this.position);
        pos.add(size.x,size.y/2);
        this.attacks.push(new Attack(pos, new PVector(10,5), this.aVelocity,this.color));
    };
    //Return number of attack objects
    this.attackNumber = function(){
        return this.attacks.length;
    };
    //Return attack object given location
    this.returnAttack = function(index){
        return this.attacks[index];
    };
    //Changes health of an entity by adding
    this.changeHealth = function(amount){
        this.health+=amount;
        if(this.health > this.maxHealth){this.health = this.maxHealth;}
    };
    //Return health of entity
    this.getHealth = function(){
        return this.health;
    };
    //Changes Max Health of an entity
    this.changeMaxHealth = function(input){
        this.maxHealth = input;
    };
    //Changes color of attack
    this.changeColor = function(input){
        this.color = input;
    };
    //Changes speed of entity
    this.changeSpeed = function(amount){
        this.velocity.add(amount);
    };
    this.showHealth = function(){
        fill(0, 255, 9);
        rect(this.position.x, this.position.y - 15+bm, this.size.x, 10);
        fill(255, 0, 0);
        rect(this.position.x, this.position.y - 15+bm, this.size.x*(this.maxHealth-this.health)/(this.maxHealth), 10);
    };
};
var Particle = function(x, y,vX, vY,size,life, c){
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.c = c;
    this.size = size;
    this.life = life;
    this.time = 0;
    this.alive = true;
    
    this.display = function(){
        var size = this.size*(this.life-this.time)/this.life;
        fill(this.c);
        ellipse(this.x, this.y, size, size);
    };
    this.update = function(){
        this.x += this.vX;
        this.y += this.vY;
        this.display();
        if(this.time >= this.life){this.alive=false;}
        this.time++;
    };
};
var star = function(position, velocity){
    this.position = position;
    this.velocity = velocity;
    this.r=3;
    this.display = function(){
        this.r = random(3,5);
        noStroke();
        fill(252, 252, 252);
        if (floor(random(1,5000))===1)
        {
            ellipse(position.x, position.y, 10,10);
        }
        else
        {
            ellipse(position.x, position.y, this.r, this.r);
        }
    };
    this.update = function(){
        this.position.add(this.velocity);
        if(this.position.x < 0){
            this.position.x = 400;
            this.position.y = random(0, 400);
        }
        this.display();
    };
};

var Game = function(){
    var player = new Entity(new PVector(-100, -200),new PVector(50,50), shipImg,new PVector(0,5), 10, 0, color(0, 255, 26), new PVector(4,0), 0);
    var score = 0;
    var scoreCheck = false;
    var enemy = [];
    var enemyAmount = 0;
    var boss = [];
    var bossAmount = 0;
    var stars = [];
    var starAmount = 50;
    var astroid = [];
    var astroidAmount = 5;
    var particles = [];
    var items = [];
    var defeatBoss = false;
    var play = false;
    var blue = 0;
    
    this.setup = function(){
        for (var i = 0; i < starAmount; i++){
            stars.push(new star(new PVector(random(0, 400), random(0, 400)), new PVector(-2,0)));
        }
        for (var i = 0; i < astroidAmount; i++){
            astroid.push(new Entity(new PVector(random(400, 500), random(0, 350)), new PVector(50,50), 
                    rockImg, new PVector(-4,0), 3, 0, color(255, 0, 0)));
        }
    };

    this.play = function(){
        this.background();
        if(player.alive && play){
            player.update();
        }
        this.objects();
        this.checkAttacks();
        if(!play){
            this.titlescreen();
        }
        if(play){this.forground();}
        if(play && !player.alive){
            for(var i = player.attacks.length-1; i >= 0; i--){
                player.attacks.splice(i,1);
            }
            fill(0, 255, 17);
            text("Game Over", 155, 100);
            text("Click to Reset", 140, 150);
        }
            
        if(player.getHealth() <= 0 && player.alive){
                    for(var k = 0; k < 60; k++){
                        var x = player.position.x+20;
                        var y = player.position.y+20;
                        var vX = random(-1,1);
                        var vY = random(-1,1);
                        particles.push(new Particle(x, y, vX, vY,5,1000, color(64, 255, 0)));
                    }
                    player.position.y = -1000;
                    player.alive = false;
        }
    };
    
    this.background = function(){
        background(0, 0, blue);
        for (var i = 0; i < stars.length; i++){
            stars[i].update();
        }
        for (var i = (particles.length - 1); i >= 0; i--){
            particles[i].update();
            if(!particles[i].alive){particles.splice(i,1);}
        }
    };
    this.forground = function(){
        fill(255, 255, 255);
        textSize(20);
        textAlign(LEFT,TOP);
        text(score, 5, 5);
    };
    this.titlescreen = function(){
            fill(0, 255, 9);
            textSize(25);
            text("Khan's Revenge", 125, 50);
            textSize(18);
            text("Press Space or Left to begin!", 125, 124);
            text("Controls:", 125, 200);
            text("Arrow Keys - Move", 125, 220);
            text("Space - Shoot", 125, 240);
            text("Click - Pause", 125, 260);
            text("Objective: Defeat the Space Dragon.", 75, 300);
            if(keys[32] || keys[LEFT]){play = true;
                player.position = new PVector(-50, 200);
            }
    };
    
    this.objects = function(){
        for (var i = 0; i < astroid.length; i++){
            astroid[i].updateAuto();
            if(astroid[i].position.x < -100){
                astroid[i].position.x = random(400,800);
                astroid[i].position.y = random(0,400);
                astroid[i].health = 100;
            }
            if(collision(player,astroid[i])){
                player.changeHealth(-1);
                astroid[i].position.x = -200;
                background(255, 0, 0);
                
            }
        }
        for (var i = 0; i < enemy.length; i++){
            enemy[i].updateAuto();
            for(var j = 0; j < enemy[i].attacks.length; j++){
                if(collision(player,enemy[i].attacks[j])){
                    player.changeHealth(-1);
                    enemy[i].attacks[j].position.x = -200;
                    background(255,0,0);
                }
            }
        }
        for (var i = 0; i < boss.length; i++){
            boss[i].updateAuto(player);
            for(var j = 0; j < boss[i].attacks.length; j++){
                if(collision(player,boss[i].attacks[j])){
                    player.changeHealth(-1);
                    boss[i].attacks[j].position.x = -200;
                    background(255,0,0);
                }
            }
        }
        for (var i = items.length-1; i >= 0; i--){
            items[i].updateAuto();
            if(items[i].position.x < -100){
                items.splice(i,1);
            }
            else if(collision(player,items[i])){
                player.changeHealth(5);
                var x = items[i].position.x+20;
                var y = items[i].position.y+20;
                    for(var k = 0; k < 5; k++){
                        var vX = random(-1,1);
                        var vY = random(-2,-3);
                        particles.push(new Particle(x, y, vX, vY,5,20, color(0, 255, 30)));
                    }
                items.splice(i,1);
                
            }   
        }
        while(astroid.length < astroidAmount){
            astroid.push(new Entity(new PVector(random(400, 500), random(0, 350)), new PVector(50,50), 
                    rockImg, new PVector(-4,0), 3, 0, color(255, 0, 0)));
        }
        if(score > (astroidAmount-4)*190){astroidAmount++;}
        if(score > 150*(enemyAmount+1)){
            enemyAmount++; 
            enemy.push(new Entity(new PVector(350, 399), new PVector(50, 50), robotImg, new PVector(0,2), 10, 1, color(255, 0, 0), new PVector(-4,0), -30));
        }
        if(score > (bossAmount+1)*1000){
            bossAmount++;
            boss.push(new Entity(new PVector(200, 399), new PVector(75, 75), dragonImg, new PVector(-2,0), 60, 2, color(255, 0, 0), new PVector(-5,0), -55));
        }
    };
    
    this.checkPlayer = function(){
        return player.alive;
    };
    
    this.checkAttacks = function(){
        for (var i = 0; i < player.attackNumber(); i++){
            for (var j = 0; j < astroid.length; j++){
                if(collision(player.attacks[i],astroid[j])){
                    astroid[j].changeHealth(-1);
                    var x = player.returnAttack(i).position.x;
                    var y = player.returnAttack(i).position.y;
                    var vY = random(-1,1);
                    var vX = random(-4,-3);
                    particles.push(new Particle(x, y, vX, vY,5,30, color(0, 255, 38)));
                    player.returnAttack(i).position.x = 800;
                }
                if(astroid[j].getHealth() <= 0){
                    score += 10;
                    for(var k = 0; k < 20; k++){
                        var x = astroid[j].position.x+20;
                        var y = astroid[j].position.y+20;
                        var vX = random(-1,1);
                        var vY = random(-1,1);
                        particles.push(new Particle(x, y, vX, vY,5,60, color(92, 88, 89)));
                    }
                    astroid[j].position.x = -200;
                    astroid[j].changeHealth(100);
                }
            }
            for (var j = boss.length-1; j >= 0; j--){
                blue++;
                if(collision(player.attacks[i],boss[j])){
                    boss[j].changeHealth(-1);
                    var x = player.returnAttack(i).position.x;
                    var y = player.returnAttack(i).position.y;
                    var vY = random(-1,1);
                    var vX = random(-4,-3);
                    particles.push(new Particle(x, y, vX, vY,5,30, color(0, 255, 38)));
                    player.returnAttack(i).position.x = 800;
                }
                if(boss[j].getHealth() <= 0){
                    blue = 255;
                    defeatBoss = true;
                    score += 200;
                    for(var k = 0; k < 30; k++){
                        var x = boss[j].position.x+20;
                        var y = boss[j].position.y+20;
                        var vX = random(-1,1);
                        var vY = random(-1,1);
                        particles.push(new Particle(x, y, vX, vY,5,60, color(2, 0, 140)));
                        items.push(new Entity(new PVector(x,y), new PVector(20,20), 
                    heartImg, new PVector(-4,0), 3, 0, color(255, 0, 0)));
                    }
                    boss.splice(j, 1);
                }
 
            }
            if(boss.length === 0 && blue > 0){blue--;}
            for (var j = enemy.length-1; j >= 0; j--){
                if(collision(player.attacks[i],enemy[j])){
                    enemy[j].changeHealth(-1);
                    var x = player.returnAttack(i).position.x;
                    var y = player.returnAttack(i).position.y;
                    var vY = random(-1,1);
                    var vX = random(-4,-3);
                    particles.push(new Particle(x, y, vX, vY,5,30, color(0, 255, 38)));
                    player.returnAttack(i).position.x = 800;
                }
                if(enemy[j].getHealth() <= 0){
                    score += 100;
                    for(var k = 0; k < 30; k++){
                        var x = enemy[j].position.x+20;
                        var y = enemy[j].position.y+20;
                        var vX = random(-1,1);
                        var vY = random(-1,1);
                        particles.push(new Particle(x, y, vX, vY,5,60, color(0, 13, 255)));
                        items.push(new Entity(new PVector(x,y), new PVector(20,20), 
                    heartImg, new PVector(-4,0), 3, 0, color(255, 0, 0)));
                    }
                    enemy.splice(j, 1);
                }
 
            }
        }
    };
};

var game = new Game();
game.setup();
var reset = false;

void mouseClicked(){
    if(pause === 0 && game.checkPlayer()){pause = 1;}
    else if(game.checkPlayer()){pause = 0;}
    else if(!game.checkPlayer()){reset = true;}
};

void draw() {
     if(pause === 0){game.play();}
     else if (pause === 1){
         fill(82, 82, 82, 200);
         rect(0,0,width,height);
         fill(255, 255, 255);
         text ("Click Screen Unpause", 125, 200);
         pause = 2;
     }
     if (reset === true){
        game = new Game();
        game.setup();
        reset = false;
     }
};