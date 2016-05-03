void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Connect 4
//Right Click to Reset Board
var mouse = [];
void mousePressed(){mouse[mouseButton]=true;};
void mouseReleased(){mouse[mouseButton]=false;};
var keys = [];
void keyPressed(){keys[keyCode]=true;};
void keyReleased(){keys[keyCode]=false;};

//Board
var Cell = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.type = 0; 
    
    this.on = function(){
        if(mouseX > this.x &&
           mouseX < this.x+this.w &&
           mouseY > this.y &&
           mouseY < this.y+this.h){return true;}
    };
    
    this.display = function(){
        switch(this.type){
            case 0:
                fill(255, 255, 255);
                break;
            case 1:
                fill(255, 0, 0);
                break;
            case 2:
                fill(0, 0, 0);
                break;
        }
        rect(this.x,this.y,this.w,this.h);
    };
};
var Board = function(col, row, x, y, w, h, connect){
    this.col = col;
    this.row = row;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cells = [];
    this.dropCells = [];
    this.turn = 1;
    this.connect = connect;
    this.win = false;
    this.animation = -1;
    h = this.y;
    
    this.cellCol = function(index){return index%this.col;};
    this.cellRow = function(index){return floor(index/this.col);};
    
    this.setup = function(){
        var width = this.w/this.col;
        var height = this.h/this.row;
        for(var r = 0; r < this.row; r++){
            for(var c = 0; c < this.col; c++){
                this.cells.push(new Cell(this.x+c*width, this.y+r*height, width, height));
            }
        }
    };
    this.reset = function(){
        this.animation = -2;
        var index = 0;
        for(var i = 0; i < this.cells.length; i++){
            if(this.cells[i].type!==0){
                var target = this.cells[i];
                this.dropCells.push(new Cell(target.x, target.y, target.w, target.h));
                this.dropCells[index].type=target.type;
                this.cells[i].type = 0;
                index++;
            }
        }
        this.turn = 1;
        this.win=false;
    };
    this.update = function(){
        if(mouse[LEFT] && !this.win && this.animation === -1){
            for(var i = 0; i < this.cells.length; i++){
                if(this.cells[i].on() && this.cells[i].type === 0){
                    var col = this.cellCol(i);
                    var row = this.row;
                    var free = false;
                    while(!free){
                        var target = (row-1)*(this.col)+col;
                        if(this.cells[target].type===0){
                            this.cells[target].type = this.turn;
                            this.turn = (this.turn)%2+1;
                            free = true;
                            this.animation = target;
                        }
                        else if(this.row===0){
                            free = true;
                        }
                        else{
                            row--;
                        }
                    }
                    mouse[LEFT]=false;
                }
            }    
            if(this.checkWin()){
                    this.win = true;
                    this.turn = (this.turn)%2+1;
            }
        }
        else if(this.animation === -2){
            for(var i = this.dropCells.length - 1; i >= 0; i--){
                this.dropCells[i].y+=5;
                if(this.dropCells[i].y > height){
                    this.dropCells.splice(i,1);
                }
            }
            if(this.dropCells.length===0){
                this.animation = -1;
            }
        }
        else if(mouse[RIGHT]){this.reset();}
        if(keys[UP]){this.moveBoard(this.x,this.y-1);}
        if(keys[DOWN]){this.moveBoard(this.x,this.y+1);}
        if(keys[LEFT]){this.moveBoard(this.x-1,this.y);}
        if(keys[RIGHT]){this.moveBoard(this.x+1,this.y);}
    };
    this.checkWin = function(){
        var index = 0;
        var checking = true;
        var turn = this.cells[index].type;
        var adjecent = 0;
        //Check Horizontal Connects
        while(index < this.cells.length){
            turn = this.cells[index].type;
            if(turn!==0){
                while(index+adjecent < this.cells.length && turn === this.cells[index+adjecent].type && this.cellRow(index) === this.cellRow(index+adjecent) && turn!==0){
                    adjecent++;
                }
            }
            else{
                adjecent++;
            }
            if(adjecent >= this.connect){
                return true;
            }
            index+=adjecent;
            adjecent = 0;
        }
        index = 0;
        //Check Vertical Connects
        while(index < this.cells.length-(this.connect-1)*this.col){
            turn = this.cells[index].type;
            if(turn!==0){
                while(index+adjecent*(this.col) <this.cells.length && turn === this.cells[index+adjecent*(this.col)].type && turn !== 0){
                    adjecent++;
                }
            }
            else{
                adjecent++;}
            if(adjecent >= this.connect){
                return true;
            }
            index++;
            adjecent = 0;
        }
        //Check Right Diagonal Connects
        index = 0;
        adjecent = 0;
        while(index < this.cells.length-(this.connect-1)*this.col){
            turn = this.cells[index].type;
            if(turn!==0 && (index+this.connect)%this.col <= this.col){
                while(index+adjecent*(this.col+1)<this.cells.length && turn === this.cells[index+adjecent*(this.col+1)].type && turn !== 0){
                    adjecent++;
                }
            }
            else{
                adjecent++;}
            if(adjecent >= this.connect){
                return true;
            }
            index++;
            adjecent = 0;
        }
        //Check Left Diagonal Connects
        index = 0;
        adjecent = 0;
        while(index < this.cells.length-(this.connect-1)*this.col){
            turn = this.cells[index].type;
            if(turn!==0 && (index-this.connect)%this.col <= this.col){
                while(index+adjecent*(this.col-1)<this.cells.length && turn === this.cells[index+adjecent*(this.col-1)].type && turn !== 0){
                    adjecent++;
                }
            }
            else{
                adjecent++;}
            if(adjecent >= this.connect){
                return true;
            }
            index++;
            adjecent = 0;
        }

    };
    
    this.display = function(){
        fill(122, 122, 122);
        rect(this.x-5,this.y-5,this.w+10,this.h+45);
        for(var i = 0; i < this.cells.length; i++){
            if(i !== this.animation){
                this.cells[i].display();}
        }
        if(this.animation > -1){
            if(h < this.cells[this.animation].y){
                fill(255,255,255);
                rect(this.cells[this.animation].x, this.cells[this.animation].y, this.cells[0].w, this.cells[0].h);
                switch((this.turn)%2+1){
                    case 1:
                        fill(255, 0, 0);
                        break;
                    case 2:
                        fill(0,0,0);
                        break;
                }
                rect(this.cells[this.animation].x, h, this.cells[0].w, this.cells[0].h);
                h+=5;
            } 
            else{
                this.animation = -1;
                h = this.y;
            }
        }
        if(this.animation === -2){
            for(var i = 0; i < this.dropCells.length; i++){
                this.dropCells[i].display();
            }
        }
        noStroke();
        fill(122,122,122);
        rect(this.x,this.y+this.h+1,this.w,39);
        stroke(0, 0, 0);
        if(this.win){
            textAlign(CENTER, CENTER);
            textSize(this.w*30/300);
            switch(this.turn){
                case 1:
                    fill(255, 0, 0);
                    text("Player 1 won!", (this.x+this.w/2), (this.y+this.h+20));
                    break;
                case 2:
                    fill(0, 0, 0);
                    text("Player 2 won!", (this.x+this.w/2), (this.y+this.h+20));
                    break;
            }
        }
        else{
            textAlign(CENTER, CENTER);
            textSize(this.w*30/300);
            switch(this.turn){
                case 1:
                    fill(255,0,0);
                    text("Player 1's turn", (this.x+this.w/2), (this.y+this.h+20));
                    break;
                case 2:
                    fill(0,0,0);
                    text("Player 2's turn", (this.x+this.w/2), (this.y+this.h+20));
                    break;
            }
        }
    };
    this.moveBoard = function(x,y){
        this.x=x;
        this.y=y;
        for(var i = 0; i < this.cells.length; i++){
            var r = floor(i/this.col);
            var c = i%this.col;
            this.cells[i].x = this.x+c*this.cells[i].w;
            this.cells[i].y = this.y+r*this.cells[i].h;
        }
    };
};

var board = new Board(10,10,50,30,300,300, 6);
board.setup();

void draw() {
    board.update();
    
    background(48, 133, 68);
    board.display();
};