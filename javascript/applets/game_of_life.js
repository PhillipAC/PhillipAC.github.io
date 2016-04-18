void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Cell Object
var Cell = function(x,y, row, alive){
    this.x = x; //Column
    this.y = y; //Row
    this.w = 400/row; //Size width
    this.h = 400/row; //Size height
    this.alive = alive; //True if alive
    this.live = alive; //True if cell will live
    this.neighber = []; //Contains all cells adjacent
    
    this.update = function(){
        var count = 0; //How many neighbers are alive
        for(var i = 0; i < this.neighber.length; i++){ 
            if(this.neighber[i].alive){count++;} //If neighber is alive add to count
        }
        if(count < 2){this.live=false;} //If neighbers are few than 2 die
        else if(count > 3){this.live = false;} //If neighbers are more than 3 die
        if(count === 3){this.live = true;} //If neighbers are 3 live or return to life
        if(this.alive === true && count === (2||3)){ //If count is 2 or 3 do not change
            this.live = true;
        }
    };
    
    this.updateLife = function(){
        if(this.live){this.alive=true;} //If it lives alive is true
        else{this.alive=false;} //If it does not live make it dead
    };
    
    this.display = function(){
        if(this.alive){fill(0,0,0);} //If alive fill black
        else{fill(255,255,255);}//If dead fill white
        rect(x*this.w,y*this.h,this.w,this.h); //Cell drawn
    };
};

//Number of rows
var row = 50;
//Contains cells
var cells = [];

for(var c = 0; c < row; c++){ //For each column
    for(var r = 0; r < row; r++){ //For each row on the column
        var alive = floor(random(0,1.99)); //Seed the cell
        cells.push(new Cell(c,r, row,alive)); //Make a cell at the location
    }
}

for(var i = 0; i < cells.length; i++){ 
    for(var j = 0; j < cells.length; j++)
    {
        //If the cell is a neighber & not itself
        if(abs(cells[i].x-cells[j].x)<=1 && abs(cells[i].y-cells[j].y)<=1 && j!==i){
            cells[i].neighber.push(cells[j]); //Add that cell to the neighber
        }
    }
}

frameRate(10); //Play the game slow

void draw() {
    for(var i = 0; i < cells.length; i++){
        cells[i].update(); //Update each cell and check if it will live or die
    }
    for(var i = 0; i < cells.length; i++){
        cells[i].updateLife(); //Update the life status of each cell
        cells[i].display(); //Display each cell
    }
};
