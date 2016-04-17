//Main Game Window
/*global background*/
var FPS = 30;

setInterval(function() {
    update(); //Game Logic
    draw(); //Game Visuals
}, 1000/FPS);

var update = function(){
    
};

var draw = function(){
    background("#0000FF");
};