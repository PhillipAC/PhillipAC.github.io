void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Global Variables
var keys = [];
var inputFields = [];
var points = [];
var collecting = true;
var eval2=eval;
var error_Message = "";
var deltaX = 0.01;
var windowX = [-20,20];
var windowY = [-20,20];
var domain = windowX[1]-windowX[0];
var range = windowY[1]-windowY[0];
var domainScal = width / domain;
var rangeScal = height / -range;
var centerX = width * (0-windowX[0])/domain;
var centerY = height*(1 - 
                (0-windowY[0])/range);

//Checks for Key Presses
void keyPressed(){
    keys[keyCode] = true;
    for(var ind in inputFields){
        inputFields[ind].typing();
    }
};
void keyReleased(){
    keys[keyCode]=false;
};
//Checks for mouse Clicks
void mouseClicked(){
    for(var ind in inputFields){
        inputFields[ind].click();
    }    
};

//Takes an expression and replaces "x" with input
var plugInX = function(expression, input){
    var exp2 = expression.split('');
    for(var term in exp2){
        if(exp2[term]==="x" || exp2[term] ==="X"){
            exp2[term]= "(" + input + ")";
        }
    }
    return exp2.join('');
};

//Calculator Display
var calculatorDisplay = function(){
    line(centerX,0,centerX,height);
    line(0,centerY,width,centerY);
    for(var i = 0; i < domain; i++){
        line(i*domainScal, centerY-3, 
             i*domainScal, centerY+3);
    }
    for(var i = 0; i < range; i++){
        line(centerX-3, -i*rangeScal,
             centerX+3, -i*rangeScal);
    }
    if (points.length!==0){
        noFill();
        beginShape();
        for(var pt in points){
            curveVertex(
                domainScal*points[pt].x+centerX, 
                rangeScal*points[pt].y+centerY);
        }
        endShape();
    }
    if(error_Message.length!== 0){
        fill(255, 0, 0);
        text(error_Message, 30, 30);
    }
};
//Calculator Graphing
var calculatorGraph = function(){
    points = [];
    for(var x = windowX[0]; x <= windowX[1]; x+=deltaX){
        var expression = plugInX(inputFields[0].getText(), x);
        var y_value;
        try {y_value = eval2(expression);}
        catch (err){
            error_Message = "Expression Error";
            break;
        }
        error_Message = "";
        //println(y_value);
        points.push(new PVector(x,y_value));
    }
};

//Function to take in input
var Input_field = function(letters, sKeys, sKeysAlt, active, pos, length, view){
    this.active = active;
    this.submitted = false;
    this.input = ['x','*','x', '/', '10','+','3'];
    this.letters = letters;
    this.sKeys = sKeys;
    this.sKeysAlt = sKeysAlt;
    this.shifting = false;
    this.pos = pos;
    this.length = length;
    this.time = 0;
    this.blinkL = 30;
    this.view = view;
};
{
Input_field.prototype.getText = function(){
    // Perform some operation
    var input = this.input;
    input = input.join('');
    return input;
};
Input_field.prototype.printText = function(){
    var input = this.input.join('');
    fill(0, 0, 0);
    if(this.time > this.blinkL || !this.active || this.submitted){
        text(input, this.pos.x+3, this.pos.y+15);}
    else{text(input+"|", this.pos.x+3, this.pos.y+15);}
    if(this.time > 2*this.blinkL){this.time=0;}
    this.time++;
};
Input_field.prototype.findArr = function(arr, value){
    for (var element in arr){
        if (String.fromCharCode(value) === arr[element]){
            return element;
        }
    }
    return false;
};
Input_field.prototype.typing = function(){
    if(this.active){
        if (keyCode === 8){this.input.splice(this.input.length-1, 1);}
        if (this.input.length <= this.length){
            var sKey = false;
            if (keyCode===187){
                if(keys[SHIFT]){this.input.push("+");}
                else{this.input.push("=");}
            }
            if (keyCode===189){
                this.input.push("-");
            }
            if (keyCode===191){
                this.input.push("/");
            }
            if(keys[SHIFT]){
                switch(String.fromCharCode(keyCode)){
                    case '8':
                        this.input.push("*");
                        break;
                    case '9':
                        this.input.push("(");
                        break;
                    case '5':
                        this.input.push("%");
                        break;
                    case '0':
                        this.input.push(")");
                        break;
                }
            }
            else{
                sKey = this.findArr(this.sKeys, keyCode);
                if(sKey!==false){this.input.push(this.sKeys[sKey]);}       
            }
            if (this.findArr(this.letters, keyCode)!==false){
                if(keys[SHIFT]){this.input.push(String.fromCharCode(keyCode).toUpperCase());}
                else{this.input.push(String.fromCharCode(keyCode).toLowerCase());}
            }
        }
    }
};
Input_field.prototype.render = function(){
    if(this.view){
        if(!this.submitted){fill(255,255,255);}
        else {fill(135, 135, 135);}
        stroke(0,0,0);
        rect(this.pos.x, this.pos.y, this.length*10, 20);
        this.printText();
        if(!this.submitted){fill(105, 134, 250);}
        else{fill(74, 74, 74);}
        rect(this.pos.x, this.pos.y + 30, 50, 20);
        fill(255, 255, 255);
        text("SUBMIT", this.pos.x + 3, this.pos.y+45);}
    
};
Input_field.prototype.click = function(){
    if(this.length !== undefined && !this.submitted){
        if(mouseX > this.pos.x && 
           mouseX < this.pos.x+this.length*10 && 
           mouseY > this.pos.y && 
           mouseY < this.pos.y+20)
        {    this.active=true;}
        else if (mouseX > this.pos.x &&
            mouseX < this.pos.x+50 &&
            mouseY > this.pos.y + 30 &&
            mouseY < this.pos.y + 50 &&
            this.input.length >= 1){
                calculatorGraph();
            }
        else{this.active=false;}
    }
};
Input_field.prototype.deactive = function(){
    this.submitted = true;
    this.active = false;
    this.view = false;
};
}//Input_field Methods

//Function input field
inputFields.push(new Input_field("ACDEFGHIJKLMNOPQRSTUVWXYZ ","1234567890", "!%*()", 
                                  false, new PVector(39,331), 35, true)); 

//Main Loop
void draw() {
    background(255, 255, 255);
    calculatorDisplay();
    fill(0, 0, 0);
    text("y =", 15, 345);
    inputFields[0].render();
    println(keyCode);
};
