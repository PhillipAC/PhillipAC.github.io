var canvas = document.getElementById("canvas");
var fps = 60;
var time = new Date();
var startTime = time.getTime();

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
var c2d = canvas.getContext("2d");

window.addEventListener("resize", function(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
})

window.setInterval(function(){
    //var c2d = canvas.getContext("2d");
    c2d.fillStyle = "green";
    c2d.fillRect(0,0,canvas.width,canvas.height); 
}, 1000/fps);