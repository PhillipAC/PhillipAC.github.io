//Importing Images for Game
/* @pjs preload="../images/boardgame.png""; */
PImage boardIMG = loadImage("../images/boardgame.png");
//Canvas Settup
void setup() { 
  size(400, 400); 
} 
var width = 400;
var height = 400;
textAlign(CENTER,CENTER);
textSize(30);

//Input Arrays
var mouse = [];
var keys = [];

//Global Settings
noStroke();

//Secret Eastereggy Stuff
var secret = [];
//Game Objects Intilized
var dice = new Dice();
var board = new Board(boardIMG, "Bridges & Shortcuts", "Trivia");
{
    board.spaces.push(new Space(0,"NONE",40,640)); //EndSlide1
    board.spaces.push(new Space(1,"NONE",80,640));
    board.spaces.push(new Space(2,"NONE",120,640));
    board.spaces.push(new Space(3,"NONE",160,640));
    board.spaces.push(new Space(4,"NONE",200,640));
    board.spaces.push(new Space(5,"NONE",240,640));
    board.spaces.push(new Space(6,"NONE",280,640));
    board.spaces.push(new Space(7,"NONE",280,600));
    board.spaces.push(new Space(8,"NONE",280,560));
    board.spaces.push(new Space(9,"NONE",280,520));
    board.spaces.push(new Space(10,"NONE",320,520));
    board.spaces.push(new Space(11,"SLIDE1",360,520)); //Slide1
    board.spaces.push(new Space(12,"NONE",400,520));
    board.spaces.push(new Space(13,"LADDER1",440,520)); //Ladder1
    board.spaces.push(new Space(14,"NONE",440,560));
    board.spaces.push(new Space(15,"NONE",440,600));
    board.spaces.push(new Space(16,"NONE",480,600));
    board.spaces.push(new Space(17,"NONE",520,600));
    board.spaces.push(new Space(18,"NONE",560,600));
    board.spaces.push(new Space(19,"NONE",600,600));
    board.spaces.push(new Space(20,"NONE",640,600));
    board.spaces.push(new Space(21,"NONE",640,560));
    board.spaces.push(new Space(22,"NONE",640,520));
    board.spaces.push(new Space(23,"NONE",640,480));
    board.spaces.push(new Space(24,"NONE",640,440));
    board.spaces.push(new Space(25,"NONE",640,400));
    board.spaces.push(new Space(26,"NONE",640,360));
    board.spaces.push(new Space(27,"NONE",600,360));
    board.spaces.push(new Space(28,"NONE",560,360));
    board.spaces.push(new Space(29,"NONE",520,360)); //EndLadder1
    board.spaces.push(new Space(30,"NONE",480,360));
    board.spaces.push(new Space(31,"SLIDE2",440,360)); //Slide2
    board.spaces.push(new Space(32,"NONE",400,360));
    board.spaces.push(new Space(33,"NONE",360,360));
    board.spaces.push(new Space(34,"NONE",320,360));
    board.spaces.push(new Space(35,"NONE",280,360));
    board.spaces.push(new Space(36,"NONE",240,360));
    board.spaces.push(new Space(37,"LADDER2",200,360)); //Ladder2
    board.spaces.push(new Space(38,"NONE",200,400));
    board.spaces.push(new Space(39,"NONE",200,440));
    board.spaces.push(new Space(40,"NONE",200,480));
    board.spaces.push(new Space(41,"NONE",160,480));
    board.spaces.push(new Space(42,"NONE",120,480));
    board.spaces.push(new Space(43,"NONE",80,480));
    board.spaces.push(new Space(44,"NONE",80,440));
    board.spaces.push(new Space(45,"NONE",80,400));
    board.spaces.push(new Space(46,"NONE",80,360));
    board.spaces.push(new Space(47,"NONE",80,320));
    board.spaces.push(new Space(48,"NONE",80,280));
    board.spaces.push(new Space(49,"NONE",80,240));
    board.spaces.push(new Space(50,"NONE",80,200));
    board.spaces.push(new Space(51,"NONE",120,200));
    board.spaces.push(new Space(52,"NONE",160,200));
    board.spaces.push(new Space(53,"NONE",200,200)); //EndLadder2
    board.spaces.push(new Space(54,"NONE",240,200));
    board.spaces.push(new Space(55,"NONE",280,200));
    board.spaces.push(new Space(56,"SLIDE3",320,200)); //Slide3
    board.spaces.push(new Space(57,"SLIDE4",360,200)); //Slide4
    board.spaces.push(new Space(58,"NONE",400,200));
    board.spaces.push(new Space(59,"NONE",440,200));
    board.spaces.push(new Space(60,"NONE",480,200));
    board.spaces.push(new Space(61,"NONE",520,200));
    board.spaces.push(new Space(62,"NONE",560,200));
    board.spaces.push(new Space(63,"NONE",600,200));
    board.spaces.push(new Space(64,"NONE",640,200));
    board.spaces.push(new Space(65,"NONE",640,160));
    board.spaces.push(new Space(66,"NONE",640,120));
    board.spaces.push(new Space(67,"NONE",640,80));
    board.spaces.push(new Space(68,"NONE",640,40));
    board.spaces.push(new Space(69,"NONE",640,20));
    board.spaces.push(new Space(69,"NONE",640,0));
    
}
//board.pawns.push(new Pawn(100, 700, color(255, 0, 255), board.spaces)); //
var camera = new Camera(500,400, board);

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
    if (board.mode === "START"){
        board.setup();
    }
    else if (board.mode === "CARD"){
        if(mouse[LEFT]){
            var answer = card.click();
            if(answer !== undefined){
                if(card.checkSolution(answer)){
                    board.mode = "ROLL";
                    dice.mode = "WAIT";
                }
                else{
                    board.nextTurn();
                    board.mode = "SWITCH";
                    camera.locked = true;
                }
                mouse[LEFT]=false;
                card = deck.takeCard(0);
                deck2.addCard(card);
                if(deck.size() === 0){
                    deck = deck2;
                    deck.shuffle();
                    deck2 = new Deck();                    
                }
            }
        }
    }
    else if (board.mode === "ROLL"){
        if(dice.mode === "WAIT"){
            dice.mode = "ROLLING";
            dice.delayCount = 0;
        }  
        else if(dice.mode === "ROLLED"){
            dice.mode = "NOT";
        }
        
    }
    else if (board.mode === "CHECK" || 
             board.mode === "SWITCH" || 
             board.mode === "MOVE"){
                 console.log(board.mode);
             }
    else{
        board.pawns = [];
        board.turn = 0;
        board.mode = "START";
        dice.mode = "WAIT";
        dice.roll = 0;
        dice.delayCount = 0;
    }
};
void mouseReleased(){mouse[mouseButton]=false;};

//Key Input Functions
void keyPressed(){keys[keyCode]=true;};
void keyReleased(){keys[keyCode]=false;};

//Displaying Loop
void draw(){
    camera.renderBoard();
    if(board.mode === "START"){
        camera.follow(board);
        board.setupRender();
        if(board.pawns.length > 0){
            board.mode = "SWITCH"
            camera.locked = true;
        }
    }
    else if (board.mode === "SWITCH"){
        if(camera.locked){
            camera.slowfollow(board.pawns[board.turn]);    
        }
        else{
            board.mode = "CARD";
        }
    }
    else if (board.mode === "CARD"){
        card.read(board.turn);
    }
    else if (board.mode === "ROLL"){
        //Pause for mousePressed function
        camera.follow(board.pawns[board.turn]);
        dice.update();
        dice.render(board.turn, board.colors[board.turn]);
        if(dice.mode==="NOT"){
            board.mode = "MOVE";    
        }
    }
    else if(board.mode==="MOVE"){
        camera.follow(board.pawns[board.turn]);
        if(dice.roll>0){
            board.pawns[board.turn].moveSpace(1);
        }
        if(board.pawns[board.turn].onTile){
            dice.roll--;
        }
        if(dice.roll <= 0){
           board.mode="CHECK";
        }
        if(board.pawns[board.turn].location === 69){
            board.mode = board.turn;
        }
    }
    else if(board.mode==="CHECK"){
        var type = board.spaces[board.pawns[board.turn].location].type;
        console.log(type);
        if(type==="NONE")
        {
            board.nextTurn();
            board.mode = "SWITCH";
            camera.locked = true;
        }
        else if(type==="SLIDE1"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-11);
        }
        else if(type==="SLIDE2"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-19);
        }
        else if(type==="SLIDE3"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-24);
        }
        else if(type==="SLIDE4"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(-25);
        }
        else if(type==="LADDER1"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(16);
        }
        else if(type==="LADDER2"){
            camera.follow(board.pawns[board.turn]);
            board.pawns[board.turn].moveSpace(16);
        }
    }
    else{
        fill(board.colors[board.mode]);
        text("Player " + (board.mode+1) + " Wins!",200,200);
    }
    //println(board.pawns[0].x + " " + board.pawns[0].y);
};