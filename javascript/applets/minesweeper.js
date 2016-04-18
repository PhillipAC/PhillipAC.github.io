void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Button
var on = function(cell){
    if(mouseX > cell.x*cell.w+40 &&
       mouseX < cell.x*cell.w + cell.w+40 &&
       mouseY > cell.y*cell.h + 40 &&
       mouseY < cell.y*cell.h + cell.h + 40){
           return true;
       }
};

//Cell Object
var Cell = function(x,y, row, alive){
    this.x = x; //Column
    this.y = y; //Row
    this.w = (width-40)/row; //Size width
    this.h = (height-40)/row; //Size height
    this.value = 0; // -1 if bomb, else how many bombs are adjacent
    this.pressed = 0; // 0 for unclicked, 1 for clicked 2 for flagged
    this.neighber = []; //Contains all cells adjacent
    this.angle = 0;
    
    this.press = function(){
        this.pressed = 1;
        if(this.value===-1){
            return true;
        }
        else if(this.value===0){
            for(var i = 0; i < this.neighber.length; i++){
                if(this.neighber[i].pressed===0)
                    {this.neighber[i].press();}
            }
            return false;
        }
        return false;
    };
    
    this.display = function(){
        pushMatrix();
        translate((this.x+0.5)*this.w+40,(this.y+0.5)*this.h+40);
        rotate(this.angle);
            if(this.pressed===0){fill(100,100,100);} //If unpressed be gray
            else if (this.pressed === 2){fill(0, 255, 64);}
            else if (this.pressed === 1 && this.value===-1){ //If pressed and a bomb be red
                fill(255, 0, 0);
            }
            else if (this.pressed === 1){ //if pressed and not a bomb be white
                fill(255,255,255);
            }
            rect(-0.5*this.w,-0.5*this.h,this.w,this.h); //Cell drawn
            if(this.pressed===1&&this.value>0){ //if there is more than 1 bomb near by tell how many
                fill(0, 0, 0);
                text(this.value, this.x, this.y);
            }
        popMatrix();
    };
};

//Number of rows
var row = 10;
//Contains cells
var cells = [];
//Number of mines
var mines = 20;
//Explosion
var explosion = false;
//0-Number of NonClicked Cells, 1-Number of cells revealed
var cellInfo = [];
var timer = 0;

for(var c = 0; c < row; c++){ //For each column
    for(var r = 0; r < row; r++){ //For each row on the column
        cells.push(new Cell(c,r, row, 0)); //Make a cell at the location
    }
}

var counter = 0;
while(counter<mines){
    var ran = floor(random(0,row*row-0.01));
    if(cells[ran].value!==-1){
        cells[ran].value=-1;
        counter++;
    }
}

for(var i = 0; i < cells.length; i++){ 
    for(var j = 0; j < cells.length; j++)
    {
        //If the cell is a neighber & not itself
        if(abs(cells[i].x-cells[j].x)<=1 && abs(cells[i].y-cells[j].y)<=1 && j!==i){
            cells[i].neighber.push(cells[j]); //Add that cell to the neighber
            if(cells[j].value===-1&&cells[i].value!==-1){cells[i].value++;}
        }
    }
}

void mouseClicked(){
    if(mouseButton===LEFT){
        for(var i = 0; i < cells.length; i++){
            if(on(cells[i])&&cells[i].pressed===0&&!explosion){
                //println(i);
                explosion = cells[i].press();
            }
        }
        if(explosion){
            for(var i = 0; i < cells.length; i++){
                if(cells[i].value===-1){
                    cells[i].pressed=1;
                }
            }
        }
    }
    if(mouseButton===RIGHT){
        for(var i = 0; i < cells.length; i++){
            if(on(cells[i])&&cells[i].pressed!==1&&!explosion){
                if(cells[i].pressed===0){
                    cells[i].pressed=2;}
                else if(cells[i].pressed===2){
                    cells[i].pressed=0;}
            }
        }
    }
};

void draw() {
    background(207+(48)*(timer)/(999), 207-207*(timer)/(999), 207-207*(timer)/999);
    fill(0, 0, 0);
    text("Mines: " + (mines-cellInfo[2]), 12, 20);
    if(timer > 99){text(timer, 300, 20);}
    else if(timer > 9){text("0" + timer, 300, 20);}
    else{text("00" + timer, 300, 20);}
    
    cellInfo[0]=0;
    cellInfo[1]=0;
    cellInfo[2]=0;
    for(var i = 0; i < cells.length; i++){
        cells[i].display();
        switch(cells[i].pressed){
            case 0:
                cellInfo[0]++;
                break;
            case 1:
                cellInfo[1]++;
                break;
            case 2:
                cellInfo[2]++;
                break;
        }
    }
    if(cellInfo[1]===row*row-mines && explosion === false){
        fill(0, 0, 0);
        text("YOU WIN!", 100, 20);
        for(var i = 0; i < cells.length; i++){
            cells[i].angle++;
        }
    }
    if(explosion===true){
        fill(255, 0, 0);
        text("OWCH!", 100, 20);
    }
    if(frameCount%60===0 && timer < 998 && cellInfo[1]!==(row*row-mines) && explosion===false){timer+=1;}
};
