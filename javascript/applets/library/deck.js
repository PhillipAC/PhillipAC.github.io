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