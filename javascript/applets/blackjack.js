//Blackjack
//Created by Phillip Clontz
//Rules: This is a simple version of blackjack or 21. You will complete against a the dealer to try and get 
//as closer to 21 without going over. Face Cards are worth 10 points, Number Cards are worth their value and 
//A's can be either 1 point or 11 points. The game alternates between the dealer and the player hitting. 
//After the second hit you will be given the option to hold. The round ends when either you or the dealer
//busts or both of you hold. If both of you hold who ever has the largest amount will win. Dealers always win
//ties. By default this game is played with 1 deck although the code can easily be changed to allow any 
//number of decks by changing the number of suits from 4 to however many you want. 
//You can play as many rounds as you want if the deck ever is empty the discard pile will be shuffled back 
//into the deck. Good luck!
//UPDATE: Added Comments

/* @pjs preload="../images/suits.png"; */
/* @pjs preload="../images/Piceratops-ulatimate.png"; */
PImage suitsIMG = loadImage("../images/suits.png");
PImage dragonIMG = loadImage("../images/Piceratops-ultimate.png");
PImage heartIMG = suitsIMG.get(200, 0, 200, 200);
PImage spadeIMG = suitsIMG.get(0,0,200,200);
PImage diamondIMG = suitsIMG.get(0,200,200,200);
PImage clubsIMG = suitsIMG.get(200,200,200,200);

void setup() { 
  size(400, 400); 
} 

var width = 400;
var height = 400;

//Card object stores a suit, value, x & y position, width and height.
var card = function(suit, value, x, y, w, h){
    this.suit = suit; //Card's suit
    this.value = value; //Card's face value
    this.x = x; //Cards upper left x cord
    this.y = y; //Cards upper left y cord
    this.w = w; //Cards width
    this.h = h; //Cards height
    this.up = false; //If false the card is faced down
    this.select = false; //If false the card is displayed as white, else it is red
    
    //Changes which side is up
    this.flip = function(){
        if(this.up){this.up=false;} //If up it will set to down
        else{this.up=true;} //If down it will set to up
    };
    
    //Draws the card, back if this.up = false, value if this.up = true
    this.read = function(){
        if(this.up){ //If faced up
            if(!this.select){fill(252, 252, 252);} //If not selected color card white
            else{fill(252, 93, 93);} //If it is selected color card red
            rect(this.x, this.y, this.w, this.h, 8*this.h/200); //Draw a proportional rectangle
            if(this.suit%2===0){ //If the suit is even...
                fill(255, 0, 0); //Set card color to red
            }
            else{
                fill(0); //Else if the suit is odd color black
            }
            //Set text to draw in the center
            textAlign(CENTER, CENTER);
            //Set text proportional to size of card
            textSize(12*this.h/120);
            var img;
            //Get image for suit (note that if you want to add more suits change switch
            //To add more suits change this.suit%4 to this.suit and change case 0 to case 4
            switch(this.suit%4){
                //If the suit is of the numerical form 1+4*n make the suit a heart
                case 1: img = spadeIMG;
                        break;
                //If the suit is of the numerical form 2+4*n make the suit a tree
                case 2: img = heartIMG;
                        break;
                //If the suit is of the numerical form 3*4*n make the suit a star
                case 3: img = clubsIMG;
                        break;
                //If the suit is of the numerical form 4*n make the suit a leaf
                //If you want to add more suits make this 4
                case 0: img = diamondIMG;
                        break;
                //Else let image be a false (this should never happen if using this.suit%4
                default: img = false;
            }
            //Face emblem
            var emblem;
            switch(this.value){
                //If value is 1 make it an ace
                case 1: emblem = "A";
                        break;
                //If value is an 11 make it a Jack
                case 11: emblem = "J";
                        break;
                //If value is a 12 make it a Queen
                case 12: emblem = "Q";
                        break;
                //If value is a 13 make it a King
                case 13: emblem = "K";
                        break;
                //If value is a 14 make it a Joker for (S since J is already taken)
                case 14: emblem = "S";
                        break;
                //All other numbers will just be face value
                default: emblem = this.value;
            }
            //Corner suit images
            image(img, this.x + 5*this.w/100, this.y + 5*this.h/200, 30*this.w/100, 30*this.h/200);
            image(img, this.x+this.w-40*this.w/100, this.y+this.h-40*this.h/200, 30*this.w/100, 30*this.h/200);
            textSize(30*this.h/200);
            //Corner suit text if there is no image for the suit
            if(!img){
                text(this.suit, this.x + 20*this.w/100, this.y + 20*this.h/200);
                text(this.suit, this.x+this.w-24*this.w/100, this.y+this.h-20*this.h/200);}
            //Corner face values
            text(emblem, this.x + 20*this.w/100, this.y + 50*this.h/200);
            text(emblem, this.x+this.w-24*this.w/100, this.y+this.h-50*this.h/200);
            //Large face value on the center of the card
            textSize(50*this.h/200);
            text(emblem, this.x+this.w/2, this.y+this.h/2);
        }
        //If the card is faced down
        else
        {
            //Make white
            fill(252, 252, 252);
            //Draw Card outline
            rect(this.x, this.y, this.w, this.h, 8*this.h/200);
            //Draw a leaf on the card
            image(dragonIMG, this.x+this.w/200, this.y + 53*this.h/200, 100*this.w/100 , 100*this.h/200);    
        }
    };
};

//Deck object stores an x & y value, width & height, a type, and a set of cards.
var deck = function(x, y, w, h, hand){
    this.cards = []; //Array of cards in deck
    this.x = x; //Deck's x position (not all cards have t ohave this value)
    this.y = y; //Deck's y position (not all cards have to have this value)
    this.w = w; //Deck's general width (not all cards have to have this value)
    this.h = h; //Deck's general height (not all cards have to have this value)
    this.speed = 5; //Default speed of cards in deck that move
    this.hand = hand; //If true when drawing the deck it will fan out the cards
    
    //fills deck with cards where each suits gets values cards
    this.create = function(suits, values, x, y, w, h){
        for (var i = 0; i < suits; i++){
            for (var j = 0; j < values; j++){
                this.cards.push(new card(i+1, j+1, x, y, w, h));
            } 
        }
    };
    
    //Returns values added together given rule
    //0 - Blackjack
    //1 - Facevalue A = 1
    this.sum = function(rule){
        var sum = 0; //Sum of cards
        var ace = 0; //Amount of aces (useful in blackjack)
        if (rule === 0){
            //look through each card
            for (var i = 0; i < this.cards.length; i++){
                if (this.cards[i].value < 2){ace++;} //If it is an ace add one to aces
                //If it is not a face card add that value
                else if (this.cards[i].value < 11){sum+= this.cards[i].value;}
                //If it is a face card count it as 10
                else{sum+=10;}
            }
            //If you have more than 1 ace add 1 for each ace you have over that first one
            if(ace > 1){sum += ace - 1;}
            //If you have at least one ace check if adding 11 will make you bust, if not add 11
            if(ace > 0 && sum+11 < 22){sum+=11;}
            //Else add 1
            else if(ace > 0 && sum+11 > 21){sum+=1;}
        }
        //Add cards value of each card for rule 1
        if (rule === 1){
            for (var i = 0; i < this.cards.length; i++){
                sum+= this.cards[i].value;
            }
        }
        //Return total sum
        return sum;
    };
    
    //Shuffles the location of cards in the cards array
    this.shuffle = function(){
        var currentIndex = this.cards.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
    
            // And swap it with the current element.
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
        
    };
    
    //Draws the card at index position in deck. 
    this.draw = function(index){
        //If index is not given let it be top card
        if (!index){index = 0;}
        
        //If there are cards in the deck
        if (this.cards.length){
            //pick the card
            var card = this.cards[index];
            //Remove the card from the deck
            this.cards.splice(index,1);
            //Return the card
            return card;
        }
    };
    
    //Adds a card to the front of a deck
    this.addCard = function(card){
        this.cards.push(card);
    };
    
    //Removes a card at the index position in deck. Does not return that card
    this.removeCard = function(index){
        if (this.cards.length){
        this.cards.splice(index,1);}
    };
    
    //Changes the ALL deck's cards to match the deck's location and size
    this.moveDeck = function(){
        for (var i = this.cards.length - 1; i > -1; i--){
            this.cards[i].x=this.x;
            this.cards[i].y=this.y;
            this.cards[i].w=this.w;
            this.cards[i].h=this.h;
        } 
    };
    
    //Moves card at index value to the deck's location over time
    //If this.hand is true it will fan the cards out else it will stack them.
    //This is an animation move
    this.moveCard = function(index){
        //Fan out cards slowly
        if(this.hand){
            if(this.cards[index].x < index*this.w/2+this.x)
                {this.cards[index].x+=this.speed;}
            else if (this.cards[index].x > index*this.w/2+this.x)
                {this.card[index].x-=this.speed;}
            if(this.cards[index].y < this.y)
                {this.cards[index].y+=this.speed;}
            else if(this.cards[index].y > this.y)
                {this.cards[index].y-=this.speed;}
            if(this.cards.length && 
                (this.cards[index].x >= index*this.w/2+this.x-this.speed/2 && 
                 this.cards[index].x <= index*this.w/2+this.x+this.speed/2) && 
                (this.cards[index].y >= this.y-this.speed/2 &&
                 this.cards[index].y <= this.y+this.speed/2))
                    {return false;}  //If not in location after moving write false
                else{return true;} //If in location after moving write true
        }
        else{
            if(this.cards[index].x < this.x)
                {this.cards[index].x+=this.speed;}
            if(this.cards[index].x > this.x)
                {this.cards[index].x-=this.speed;}
            if(this.cards[index].y < this.y)
                {this.cards[index].y+=this.speed;}
            if(this.cards[index].y > this.y)
                {this.cards[index].y-=this.speed;}
            if(this.cards.length && 
                (this.cards[index].x >= this.x-this.speed/2 && this.cards[index].x >= this.x+this.speed/2) &&
                (this.cards[index].y >= this.y-this.speed/2 && this.cards[index].x >= this.x+this.speed/2))
                    {return false;} //If not in location after moving write false
                else{return true;} //If in location after moving write true
        }
    };
    
    //Reverses the order of the cards in a deck
    this.flipDeck = function(){
        var tempDeck = [];
        for(var i =1; i <= this.cards.length; i++)
        {
            tempDeck.push(this.cards[this.cards.length-i]);
        }
        this.cards = tempDeck;
    };
    
    //Adds all the cards from a deck to this deck. Deletes those cards from old deck
    this.addDeck = function(deck, flip){
        for(var i = deck.cards.length - 1; i > -1; i--){
            if(flip){deck.cards[i].flip();}
            this.addCard(deck.draw(i));
            deck.removeCard(i);
        }
    };
};

var thisDeck = new deck(5, 5, 60, 120, false);   //Playing Deck
var pile = new deck(330, 130, 60, 120, false);     //Discard Pile
var hand = new deck(5, 270, 60, 120, true);      //Your hand
var dealer = new deck(70, 5, 60, 120, true);     //Dealer's hand

thisDeck.create(4, 13, 5, 5, 60, 120); //Load Deck with 4 suits and 13 values
thisDeck.shuffle(); //Shuffle Deck

var animation  = false; //If your cards are moving set true
var animation2 = false; //If dealer's cards are moving set true
var yourTurn   = false; //If your turn set true
var dealerBust = false; //If dealer busts set true
var youBust    = false; //If you bust set true
var dealerHold = false; //If dealer is holding set true
var youHold    = false; //If you are holding set true
var current;   //Index of top card in hand
var current2;  //Index of top card in dealer's hand

//All of the player's controls are located in the mouseClicked function
void mouseClicked(){
    //If someone has busted reset the game and discard to pile
    if (youBust || dealerBust){
        pile.addDeck(hand);
        pile.addDeck(dealer);
        pile.moveDeck();
        youBust=false;
        dealerBust=false;
        yourTurn = false;
        animation = false;
        animation2 = false;
        dealerHold = false;
        youHold = false;
    }
    //If it is your turn, nothing is moving, and nothing has busted
    if(!animation && !animation2 && yourTurn && !youBust && !dealerBust){
        //If you press at the hit location
        if(mouseX > 49 && mouseX < 49+80 && mouseY > 183 && mouseY < 183+40){
            //If there are cards in the deck
            if (thisDeck.cards.length){
                //Pull a card
                var card = thisDeck.draw();
                //Flip card face up
                card.flip();
                //Add card to your hand
                hand.addCard(card);
                //Set animation to true to move it to your hand's location
                animation = true;
                yourTurn = false;
                if(hand.cards.length && hand.sum(0) > 21){youBust = true;}
                if(hand.cards.length===2 && hand.sum(0) === 21){dealerBust = true; youHold = true; dealerHold = true;}
            }
            //If there are no cards in the deck
            else{
                //Add discard pile to the deck
                thisDeck.addDeck(pile, true);
                //Move deck to it's correction location
                thisDeck.moveDeck();
                //Shuffle the deck
                thisDeck.shuffle();
            }
            //If you have busted or the dealer has busted it will show the dealer's hand
            if(youBust || dealerBust){
                for(var i = 1; i < dealer.cards.length; i++){dealer.cards[i].flip();}
            }
        }
        //If you choose to hold set youHold true and end your turn
        if (mouseX > 150 && mouseX < 150+88 && mouseY > 183 && mouseY < 183 + 40){
            youHold = true;
            yourTurn = false;
        }
    }
};

//All the dealer's controls, animations, and visuals are located on in the draw function
//These keep updating constantly allowing the dealer to automatically play on their turn
void draw() {
    //If neither you nor the dealer has busted and both are holding
    //see who won and set them to loser to bust
    if(youHold && dealerHold && !(dealerBust || youBust)){
        for(var i = 1; i < dealer.cards.length; i++){dealer.cards[i].flip();}
        if (dealer.sum(0) >= hand.sum(0)){youBust=true;}
        else {dealerBust=true;}
    }
    //If neither you or the dealer has busted it is the dealer's turn
    //Dealer's Turn is Perormed Automatically after player's
    if(!dealerBust && !youBust){
        //If the dealer has cards that add to be over 17 he will hold
        if(!yourTurn && dealer.cards.length && dealer.sum(0) > 17){yourTurn = true; dealerHold = true;}
        //If nothing is moving and it is not your turn
        if(!animation && !animation2 && !yourTurn)
        {
            //If there are cards in the deck
            if (thisDeck.cards.length){
                //Draw a card
                var card = thisDeck.draw();
                //If it is the first card flip it face up
                if(!dealer.cards.length){card.flip();}
                //Add card to the dealer's hand
                dealer.addCard(card);
                //Set dealer animation to true
                animation2 = true;
                //If the dealer has more than 21 points and 
                if(dealer.sum(0) > 21){dealerBust = true;}
            }
            //If there are no cards to draw from
            else{
                thisDeck.addDeck(pile, true);
                thisDeck.moveDeck();
                thisDeck.shuffleDeck();
            }
            //If the dealer has busted show all the dealer's cards
            if(dealerBust){
                for(var i = 1; i < dealer.cards.length; i++){dealer.cards[i].flip();}
            }
        }
    }
    //Finds top card of hand
    current = hand.cards.length-1;
    current2 = dealer.cards.length-1;
    
    //Resets Screen with table
    background(0, 255, 17);
    
    //Show hit and stay buttons if it is your turn and no one has busted
    if(yourTurn && !dealerBust && !youBust){
        fill(0, 255, 230);
        rect(49, 183, 80, 40, 10);
        if(hand.cards.length >= 2){rect(150,183,88,40,10);}
        fill(0, 0, 0);
        textSize(30);
        text("HIT!", 89, 203);
        if(hand.cards.length >= 2){text("STAY!",194,203);}
    }
    
    //If the deck has cards show the top card
    if(thisDeck.cards.length){thisDeck.cards[0].read();}
    //If the discard has cards show the top card
    if(pile.cards.length){pile.cards[pile.cards.length-1].read();}
    
    //Display all the cards in dealer's hand
    for( var i = 0; i < dealer.cards.length; i++){dealer.cards[i].read();}
    //Display all the cards in your hand
    for( var i = 0; i < hand.cards.length; i++){hand.cards[i].read();}
    
    //If animation is on move the top card of hand to the hand location
    if(animation){animation=hand.moveCard(current);}
    //If animation2 is on move the top card of dealer to the dealer's location
    if(animation2){
        animation2=dealer.moveCard(current2);
        if(!animation2){yourTurn = true;}
    }
    //If you have decided to hold it will skip your turn
    if(youHold){yourTurn = false;}
    
    //If both people have not held
    if (!(youHold && dealerHold))
    {
        //If you busted
        if(youBust){
            textSize(50);
            text("You have busted!", width/2, height/2);
        }
        //If the dealer busted
        if(dealerBust){
            textSize(35);
            text("The dealer has busted!", width/2, height/2);
        }
    }
    //If both parties have decided to hold then youBust and dealerBust hold who had the lower score
    else
    {
        //Says the dealer has one
        if(youBust){
            textSize(50);
            text("Dealer Won!", width/2, height/2);
        }
        //Say you have one
        if(dealerBust){
            textSize(35);
            text("You Won!", width/2, height/2);
        }    
    }
};
