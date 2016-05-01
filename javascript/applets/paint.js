var canvas = document.getElementById("canvas");
var fps = 60;
var time = new Date();
var startTime = time.getTime();
var mousePressed = false;

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var c2d = canvas.getContext("2d");

//Event Listeners
//Adjusts the game window when the screen is adjusted
/*
window.addEventListener("resize", function(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
})*/
window.addEventListener("mousedown", function(e){
    mousePressed=true;
})
window.addEventListener("mouseup", function(e){
    mousePressed=false;
})
window.addEventListener("mousemove", function(e){
    console.log(mousePressed);
    if(mousePressed){
        var c2d = canvas.getContext("2d");
        c2d.fillStyle = "black";
        c2d.beginPath();
        c2d.ellipse(e.clientX, e.clientY, 5, 5, 0, 0, 2*Math.PI);
        c2d.fill();
    }
})


//Game Window
window.setInterval(function(){
    //var c2d = canvas.getContext("2d");
    //c2d.fillStyle = "green";
    //c2d.fillRect(0,0,canvas.width,canvas.height); 
}, 1000/fps);