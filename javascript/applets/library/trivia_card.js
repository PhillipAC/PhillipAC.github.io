//Global Functions
var isHovering = function(obj){
    if (mouseX > obj.x && mouseX < obj.x+obj.w &&
        mouseY > obj.y && mouseY < obj.y+obj.h){
            return true;
        }
    return false;
};//Returns true if mouse is hovering over obj

//Trivia card constructor
var Card = function(question, answers, index, img){
    this.question = question; //String to hold question
    this.answers = answers; //Array to hold string of 4 questions
    this.solutionIndex = index; //Integer indexing correct answer
    this.img = img;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
};
Card.prototype.getQuestion = function(){
    return this.question;
};//Returns the question
Card.prototype.getAnswers = function(i) {
    if(i!==undefined){
        return this.answers[i];
    }
    else{
        return this.answers;
    }
};//Returns either specific answer or array
Card.prototype.getSolutionIndex = function(){
    return this.solutionIndex;
}; //Return the index of answer
Card.prototype.getSolution = function() {
    return this.getAnswers(this.getSolutionIndex());
}; //Return the string of answer
Card.prototype.read = function(player){
    textAlign(TOP,LEFT);
    textSize(10);
    fill(255,255,255);
    rect(this.x, this.y, this.w, this.h);
    fill(0,0,0);
    text(this.question, this.x+5, this.y+5, this.w, 400);
    for(var i = 0, j = this.answers.length; i < j; i++){
        text((i+1) + ") " + this.answers[i], this.x + 5, 
             this.y + 15*(i+1) + 20, this.w, 400);
    }
    if(this.img !== undefined){
        image(this.img, this.x+5, this.y+15*(this.answer.length+2)+20);
    }
    this.inputDis();
    fill(0,0,0);
    text("Player " + (player+1) + "'s Question", this.x + 100, this.y+43);
    textAlign(CENTER,CENTER);
    textSize(30);
}; //Displays card and info
Card.prototype.setLoc = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}; //Sets the position and size of card
Card.prototype.inputDis = function(){
    for(var i = 0, j = this.answers.length; i < j; i++){
        var answerObj = {x:this.x + 5,y:this.y + 15*(i+1) + 18,
                     w:this.w-10, h:13}
        fill(0,0,0,0);
        //rect(answerObj.x, answerObj.y, answerObj.w, answerObj.h);
        if(isHovering(answerObj)){
                //noStroke();
                fill(255,0,0,100);
                rect(answerObj.x, answerObj.y, answerObj.w, answerObj.h);        
            }

    }
}; //Highlights answer mouse is over
Card.prototype.checkSolution = function(i){
    if (i === this.getSolutionIndex()){
        return true;
    }
    else{
        return false;
    }
}; //Checks if "i" is the solution
Card.prototype.click = function(){
    for(var i = 0, j = this.answers.length; i < j; i++){
        var answerObj = {x:this.x + 5,y:this.y + 15*(i+1) + 18,
                     w:this.w-10, h:13};
        if(isHovering(answerObj)){
                return i;     
        }
    }    
}; //Returns the index of the answer hovered over