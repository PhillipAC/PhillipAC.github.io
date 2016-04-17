void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

var poly = [];
var lines = [];
var points = [];
var mode = 0;
var scaler = 1.5;
var scaler2 = -1;
var modes = ["Translation", "Reflection", "Rotation", "Dilation"];
void mousePressed(){
    for (var i in poly){
        if(poly[i].moveable){
        poly[i].checkClick();}
    }
    for (var i in lines){
        lines[i].checkClick();
    }
    for (var i in points){
        if(points[i].moveable){
            points[i].checkClick();
        }
    }
    if(mouseX > 5 && mouseX < 35 & mouseY > 365 && mouseY < 395){
        mode--; 
        if(mode < 0){mode = modes.length -1;}
    }
    if(mouseX > 400-35 && mouseX < 395 && mouseY > 365 && mouseY < 395){
        mode++;
        mode %= modes.length;
    }
    if(mouseButton === RIGHT){
        poly[0].coord.push(new PVector(mouseX, mouseY));
    }
};
void mouseReleased(){
    for (var i in poly){
        poly[i].select = 0;
    }
    for (var i in lines){
        lines[i].deselect();
    }
    for (var i in points){
        points[i].select = 0;
    }
};
void keyPressed(){
    if(keyCode === LEFT){
        scaler-=0.1;
    }
    if(keyCode === RIGHT){
        scaler+=0.1;
    }
    if(keyCode === UP){
        scaler2+= 0.1;
    }
    if(keyCode === DOWN){
        scaler2-= 0.1;
    }
    
};

var dist2 = function(v, w){ 
    return sq(v.x - w.x) + sq(v.y - w.y); };
var perp = function(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 === 0) {return new PVector(p.x - v.x, p.y - v.y);}
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  return new PVector(v.x + t * (w.x - v.x),
                     v.y + t * (w.y - v.y));
};

var Point = function(x, y, size, moveable, c){
    this.x = x;
    this.y = y;
    this.size = size;
    this.c = c;
    this.moveable = true;
    this.hasRotation = false;
    this.rotation = 0;
};
{
Point.prototype = Object.create(PVector.prototype);    
Point.prototype.checkClick = function(){
    if(dist2(new PVector(mouseX, mouseY), this) < this.size){
        this.select = 1;
    }
    if(this.hasRotation){
        var dial = new PVector(0, -this.size*2);
        dial.rotate(this.rotation);
        if(dist2(new PVector(this.x+dial.x, this.y+dial.y), new PVector(mouseX,mouseY)) <
                sq(this.size)){
                    this.select = 2;
                }
    }
};
Point.prototype.update = function(){
    if(this.select === 1){
        this.x = mouseX;
        this.y = mouseY;
    }  
    if(this.select === 2){
        var turn = new PVector(mouseX-this.x,mouseY-this.y);
        this.rotation = PVector.angleBetween(turn, new PVector(0,-1));
        if(mouseX < this.x){
            this.rotation=-this.rotation;
        }
    }
};
Point.prototype.display = function(){
    fill(this.c);
    ellipse(this.x, this.y, this.size, this.size);
    if(this.hasRotation){
        var dial = new PVector(0, -this.size*2);
        dial.rotate(this.rotation);
        ellipse(this.x+dial.x, this.y+dial.y, this.size, this.size);
    }
};}

var Polygon = function(coord, move, c){
    this.coord = coord;
    this.moveable = move;
    this.select = 0;
    this.c = c;
};
{
Polygon.prototype.display = function(){
    fill(this.c);
    beginShape();
    for (var i = 0; i < this.coord.length; i++){
        vertex(this.coord[i].x,this.coord[i].y);
    }
    vertex(this.coord[0].x,this.coord[0].y);
    endShape();
    if(this.moveable){
        for (var i = 0; i < this.coord.length; i++){
            ellipse(this.coord[i].x, this.coord[i].y, 5, 5);
        }
    }
};
Polygon.prototype.update = function(){
    if(this.select !== 0){
        this.coord[this.select-1] = new PVector(mouseX,mouseY);
    }
};
Polygon.prototype.checkClick = function(){
    for ( var i = 0; i < this.coord.length; i++){
        if (dist2(new PVector(mouseX,mouseY),this.coord[i]) < 25){
            this.select = i+1;
        }
    }
};
Polygon.prototype.translate = function(x,y, c, show){
    if(!c){c=this.c;}
    
    var move = new PVector(x,y);
    var image = [];
    for ( var i = 0; i < this.coord.length; i++){
        if(show){
            stroke(0, 0, 0);
            line(this.coord[i].x, this.coord[i].y, this.coord[i].x+move.x, this.coord[i].y+move.y);
            stroke(0, 0, 255);
            line(this.coord[i].x, this.coord[i].y, this.coord[i].x+move.x, this.coord[i].y);
            stroke(194, 0, 0);
            line(this.coord[i].x + move.x, this.coord[i].y, this.coord[i].x + move.x, this.coord[i].y+move.y);
            stroke(0,0,0);
        }
        image.push(PVector.add(this.coord[i],move));
    }
    return new Polygon(image, false, c);
};
Polygon.prototype.reflect = function(reflect, c, show){
    if(!c){c=this.color;}
    fill(c);
    var image = [];
    var perpline = 0;
    for( var i = 0; i < this.coord.length; i++){
        perpline = perp(this.coord[i], reflect.point1, reflect.point2);
        if(show){line(this.coord[i].x, this.coord[i].y, -this.coord[i].x+2*perpline.x, -this.coord[i].y+2*perpline.y);}
        image.push(new PVector(
            this.coord[i].x+2*(perpline.x-this.coord[i].x),
            this.coord[i].y+2*(perpline.y-this.coord[i].y)));
    }
    return new Polygon(image, false, c);
};
Polygon.prototype.dilation = function(pt,amount, c, show){
    if(!c){c=this.color;}
    var loc = new PVector(pt.x,pt.y);
    var image = [];
    var lines;
    for (var i = 0; i < this.coord.length; i++){
        lines = PVector.sub(this.coord[i],loc);
        lines.mult(amount);
        lines.add(loc);
        if(show){line(loc.x, loc.y , lines.x, lines.y);}
        image.push(lines);
    }
    return new Polygon(image, false, c);
};
Polygon.prototype.rotation = function(pt,amount, c, show){
    if(c===undefined){c=this.color;}
    var loc = new PVector(pt.x,pt.y);
    var image = [];
    var lines = [];
    for (var i = 0; i < this.coord.length; i++){
        lines = PVector.sub(this.coord[i], loc);
        lines.rotate(-amount);
        lines.add(loc);
        if(show){line(loc.x, loc.y, this.coord[i].x, this.coord[i].y);
        line(loc.x, loc.y, lines.x, lines.y);}
        image.push(lines);
    }
    return new Polygon(image, false, c);
};}

var Line = function(point1, point2){
    this.point1 = point1;
    this.point2 = point2;
        this.lowerPoint = 0;
        this.upperPoint = 0;
    this.slope = 0;
    this.select = 0;
    this.create = function(){
        if(this.point2.x!==this.point1.x){
        this.slope = (this.point2.y-this.point1.y)/(this.point2.x-this.point1.x);
        this.upperPoint = new PVector(0, 
                this.slope*(0-this.point1.x)+this.point1.y);
        this.lowerPoint = new PVector(width, 
                this.slope*(width-this.point1.x)+this.point1.y);}
        else{
            this.upperPoint = new PVector(this.point2.x, 0);
            this.lowerPoint = new PVector(this.point2.x, height);
        }
    };
    this.create();
};
{
Line.prototype.display = function(){
    fill(this.c);
    line(this.upperPoint.x, this.upperPoint.y,
            this.lowerPoint.x, this.lowerPoint.y);
    this.point1.display();
    this.point2.display();
};
Line.prototype.update = function(){
    if(this.point1.select === 1){
        this.point1.update();
        this.create();
    }
    else if (this.point2.select === 1){
        this.point2.update();
        this.create();
    }
};
Line.prototype.checkClick = function(){
    this.point1.checkClick();
    this.point2.checkClick();
};
Line.prototype.deselect = function(){
    this.point1.select = 0;
    this.point2.select = 0;
};}

points.push(new Point(200, 200, 5, true, color(0, 255, 38)));
points[0].rotate = 90;
poly.push(new Polygon([new PVector(189,101), 
                            new PVector(215,60),
                            new PVector(148,103),
                            new PVector(202, 150)], true, color(255, 0, 0)));
lines.push(new Line(new Point(100, 100, 5, true, color(255,0,0)), 
                    new Point(50, 300, 5, true, color(255,0,0))));
poly.push(poly[0].rotation(200, 200, 45, color(0,255,0)));
poly.push(poly[0].translate(100, 200, color(0, 255, 30)));
poly.push(poly[0].reflect(lines[0], color(0, 255, 0)));
poly.push(poly[0].dilation(points[0], 1.5, color(0, 255, 0)));

void draw() {
    background(255, 255, 255);
    poly[0].display();
    for (var i in points){points[i].update();}
    for (var i in poly){poly[i].update();}
    for (var i in lines){lines[i].update();}
    if(mode === 0){
                poly[1].display();
                poly[1]=poly[0].translate(50*scaler, -50*scaler2, color(0, 255, 30, 100), true);
    }
    else if (mode === 2){
                poly[2].display();
                points[0].hasRotation = true;
                points[0].display();
                poly[2] = poly[0].rotation(points[0], -points[0].rotation+180, color(0,255,0, 100), true);
    }
    else if (mode === 1){
                poly[3].display();
                lines[0].display();
                poly [3] = poly[0].reflect(lines[0], color(0, 255, 0, 100), true);
    }
    else {
                poly[4].display();
                points[0].hasRotation = false;
                points[0].display();
                poly[4] = poly[0].dilation(points[0], scaler, color(0, 255, 0, 100), true);
    }
    fill(0, 0, 0);
    text("Press Left and Right to swap between Transformations", 20, 20);
    text("Current Transformation: " + modes[mode], 20, 35);
    if(mode===2){
        text("Angle: " + (-points[0].rotation+180), 20, 50); 
    }
    if(mode===0){
        text("Transtion: <" + round(10*scaler)/10 + ", " + round(10*scaler2)/10 + ">", 20, 50);
    }
    if(mode===3){
        text("Scale Factor: " + (round(scaler*10)/10), 20, 50);
        for(var i in poly[4].coord){
            line(points[0].x, points[0].y, poly[0].coord[i].x, poly[0].coord[i].y);}
    }
    fill(232, 183, 183);
    rect(5, 365, 30, 30);
    rect(400-35, 365, 30, 30);
    fill(0,0,0);
    text("<-", 13, 384);
    text("->", 400-23, 384);
};
