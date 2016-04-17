var c = document.getElementById("gameScreen");
var ctx = c.getContext("2d");

var background = function(color){
    ctx.fillStyle = color;
    ctx.fillRect(0,0,c.width,c.height);
};