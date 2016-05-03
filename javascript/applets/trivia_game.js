void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Input Arrays
var mouse = [];
var keys = [];

//Global Settings
noStroke();

//Global Functions
var isHovering(obj){
    if (mouseX > obj.x && mouseX < obj.x+obj.w &&
        mouseY > obj.y && mouseY < obj.y+obj.h){
            return true;
        }
    return false;
}//Returns true if mouse is hovering over obj

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
Card.prototype.read = function(){
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
}; //Displays card and info
Card.prototype.setLoc = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}; //Sets the position and size of card
Card.prototype.inputDis = function(){
    for(var i = 0, j = this.answers.length; i < j; i++){
        answerObj = {x:this.x + 5,y:this.y + 15*(i+1) + 18,
                     w:this.w-10, h:13}
        fill(0,0,0,0);
        //rect(answerObj.x, answerObj.y, answerObj.w, answerObj.h);
        if(isHovering(answerObj)){
                //noStroke();
                fill(255,0,0,100);
                rect(answerObj.x, answerObj.y, answerObj.w, answerObj.h);        
            }

    }
} //Highlights answer mouse is over

//Deck Constructor
var Deck = function(){
    this.cards = []; //Array to hold cards
};
Deck.prototype.shuffle = function(){
    this.oldDeck = this.cards;
    this.cards = [];
    var randomCard = 0;
    while(this.oldDeck.length > 0){
        randomCard = floor(random(0,this.oldDeck.length-0.01));
        this.cards.push(this.oldDeck[randomCard]);
        this.oldDeck.splice(randomCard, 1);
    }
};//Reorders the cards randomly
Deck.prototype.addCard = function(card) {
    this.cards.push(card);
};//Adds card to deck
Deck.prototype.removeCard = function(index){
    this.cards.splice(index,1);
};//Removes index of card
Deck.prototype.takeCard = function(index){
    var card = this.cards[index];
    this.cards.splice(index,1);
    return card;
};//Returns index card and removes it
Deck.prototype.size = function(adjust){
    if(adjust!==undefined){
        return this.cards.length-adjust;
    }
    return this.cards.length;
};//Returns number of cards minus adjust
Deck.prototype.replaceCard = function(index, card) {
    this.cards.splice(index,1,card);
};//Replaces index of card with new card
Deck.prototype.setLoc = function(x,y,w,h){
    for(var i = 0, j = this.cards.length; i < j; i++){
        this.cards[i].setLoc(x,y,w,h);
    }
};//Give all cards in deck that location and size
Deck.prototype.getCard = function(index){
    return this.cards[index];
};//Returns index card in the deck

//Dice Constructor
var Dice = function(sides, delay){
    this.sides = sides;
    this.mode = "NONE";
    this.timer = 0;
    this.delay = delay;
};
Dice.prototype.roll = function(){
    if(this.mode === "NONE"){
        this.mode = "ROLLING";
        this.timer=0;
    }
    if(this.mode === "ROLLING"){
        this.timer++;
        this.value = floor(random(1, this.sides-0.1));
    }
    if(this.timer>this.delay){
        this.mode = "NONE";
        return true;
    } 
    return false;
};//Rolls a dice for delay then returns true when finished

//Creating Game Objects
var deck = new Deck(); //Creating question deck
var deck2 = new Deck(); //Creating a discard deck

//Adding Trivia Cards to question deck
{
deck.addCard(new Card("Which American state is nearest to the former Soviet Union?", 
            ["Alabama", "Alaska", "Main", "Maryland"], 1));
deck.addCard(new Card("In which year did Foinavon win the Grand National?", 
            ["1976", "1985", "1967", "1990"], 2));
deck.addCard(new Card("On TV, who did the character Lurch work for?", 
            ["Addam's Family", "Brady Bunch", "Husables", "The Jeffersons"], 0));
deck.addCard(new Card("What is converted into alcohol during brewing?", 
            ["wheat", "sugar", "citric acid", "grain"], 1));
deck.addCard(new Card("Which river forms the eastern section of the border between England and Scotland?",
            ["Tweed", "Nile", "Eurthades", "Bolger"], 0));
deck.addCard(new Card("In what year was Prince Andrew born?", 
            ["1950", "1960", "1970", "1980"], 1));
deck.addCard(new Card("If cats are feline, what are sheep?", 
            ["lamic", "galic", "doe", "ovine"], 3));
deck.addCard(new Card("For which fruit is the US state of Georgia famous?", 
            ["Apple", "Peach", "Orange", "Grape"], 1));
deck.addCard(new Card("What does a numismatist study or collect?", 
            ["numbers", "numists", "numbing agents", "coins"], 3));
deck.addCard(new Card("In which 1979 film was the spaceship called Nostromo?", 
            ["2001 Space Odyesse", "Star Treck", "Aliens", "Star Wars"], 2));
deck.addCard(new Card("What is an otter's home called?", 
            ["Den", "Holt", "Cabin", "Dream"], 1));
}

//Set all cards to be in the top left hand corner
deck.setLoc(10, 10, 300, 100);
//Shuffle Deck
deck.shuffle();
//Pull the first card
var card = deck.takeCard(0);


//Mouse Input Functions
void mousePressed(){
    mouse[mouseButton]=true;
    if(mouse[LEFT]){
        if(deck.size()>0){
            mouse[LEFT]=false;
            card = deck.takeCard(0);
            deck2.addCard(card);
        } //If there are cards in the deck pull one from the top
        else{
            deck = deck2;
            deck.shuffle();
            deck2 = new Deck();
        } //If there are no cards reshuffle discard pile
    }
};
void mouseReleased(){mouse[mouseButton]=false;};

//Key Input Functions
void keyPressed(){keys[keyCode]=true;};
void keyReleased(){keys[keyCode]=false;};

//Displaying Loop
void draw(){
    background(0,255,0); //Sets a background color
    card.read(); //Displays the current card
}