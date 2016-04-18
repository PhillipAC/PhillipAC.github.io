/* @pjs preload="images/Piceratops-ultimate.png"; */
/* @pjs preload="images/Rock.png"; */
PImage dragon = loadImage("images/Piceratops-ultimate.png");
PImage back = loadImage("images/Rock.png");

void setup() { 
  size(400, 400); 
} 

var width = 400;
var height =400;
var t = 0;

void draw() {
    background(255*sin(t),255*cos(t),255*sin(2*t));
    image(back, 0, 0, 300*(sin(t)+4)/2, 300*(cos(t)+4)/2);
    image(dragon, 80, 80, 100*(2*cos(0.5*t)+4)/2, 100*(sin(t)+5)/2);
    t+=PI/180;
};
