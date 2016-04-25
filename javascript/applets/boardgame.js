/* @pjs preload="../images/grass.jpg"; */
PImage grassIMG = loadImage("../images/grass.jpg");

void setup() { 
  size(800, 800); 
} 

var width = 800;
var height = 800;

var render_Background = function(){
    for(var i = 0; i < 800; i+=40){
        for(var j = 0; j < 800; j+=40){
            image(grassIMG, i, j, 40, 40);
        }
    }
};

void draw(){
    render_Background ();
};