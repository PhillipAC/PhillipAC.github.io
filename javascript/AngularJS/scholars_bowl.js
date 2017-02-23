$("#summaryToggle").click(function(e){
	e.preventDefault();
	$("#summaryTable").slideToggle();
});

$("#nameToggle").click(function(e){
	e.preventDefault();
	$("#nameTable").slideToggle();
});

var Player = function(id, name){
	this.id = id;
	this.name = name;
	this.scores = [];
	this.team;
};

var Question = function(id){
	this.id = id;
	this.playerId = -1;
	this.bonusIdA = -1;
	this.bonusIdB = -1;
};

var Team = function(id, name){
	this.id = id;
	this.name = name;
	this.members = [];
};

var Worksheet = function(id){
	this.id = id
	this.scores = [0,0];
};

var Round = function(id, questions){
	this.id = id;
	this.squads = [];
	this.questions = questions;
};
Round.prototype.question = function(questionId){
	for(var i = 0; i < this.questions.length; i++){
		if(questionId == this.questions[i].id){
			return this.questions[i];
		}
	}
	return false;
}
Round.prototype.squad = function(squadId){
	for(var i = 0; i < this.squads.length; i++){
		if(squadId == this.squads[i].id){
			return this.squad[i];
		}
	}
	return false;
}

var Squad = function(players){
	this.players = players;
};

var Game = function(id, title){
	this.id = id;
	this.title = title
};
Game.prototype.score = function(player, questions){
	var score = 0;
	for(var i = 0; i < questions.length; i++){
		if(questions[i].playerId==player.id){
			score+=10;
		} 
	}
	return score;
}
Game.prototype.bonusScoreA = function(team, questions){
	var score = 0;
	for(var i = 0; i < questions.length; i++){
		if(questions[i].bonusIdA==team.id){
			score+=10;
		}
	}
	return score;
}
Game.prototype.bonusScoreB = function(team, questions){
	var score = 0;
	for(var i = 0; i < questions.length; i++){
		if(questions[i].bonusIdB==team.id){
			score+=10;
		}
	}
	return score;
}
Game.prototype.teamScore = function(team, questions, worksheet){
	var score = 0;
	for(var i = 0; i < team.members.length; i++){
		score+=this.score(team.members[i], questions);
	}
	score += this.bonusScoreA(team,questions);
	score += this.bonusScoreB(team,questions);
	score += worksheet.scores[team.id];
	return score;
}

var app = angular.module('scholarsbowl', []);
app.controller('scoresheet', function($scope){
	window.scope = $scope;
	//Initialize Players
	$scope.players = [];
	for(var i = 0; i < 16; i++){
		$scope.players.push(new Player(i, "Player_" + (i)));
	}
	var halfCount = $scope.players.length/2;
	
	//Initialize Teams
	$scope.teams = [];
	for(var i = 0; i < 2; i++){
		$scope.teams.push(new Team(i, "Team_" +  String.fromCharCode(97 + i).toUpperCase()));
		for(var j = i*halfCount; j < (i+1)*halfCount; j++){
			$scope.teams[i].members.push($scope.players[j]);
			$scope.players[j].team = $scope.teams[i].id;
		}
	}
	
	//Initialize Rounds and Questions
	$scope.rounds = [];
	$scope.questions = [];
	for(var i = 0; i < 2; i++){
		var roundQuestions = [];
		for(var j = 0; j < 10; j++){
			roundQuestions.push(new Question(j+i*10));
		}
		$scope.rounds.push(new Round(i, roundQuestions));
		$scope.questions = $scope.questions.concat(roundQuestions);
		var squad1 = [];
		var squad2 = [];
		for(var j = 0; j < 4; j++){
			squad1.push($scope.teams[0].members[j+4*i]);
			squad2.push($scope.teams[1].members[j+4*i]);
		}
		$scope.rounds[i].squads.push(new Squad(squad1));
		$scope.rounds[i].squads.push(new Squad(squad2));
	}
	
	//Initialize Worksheet
	$scope.worksheet = new Worksheet(0);
	
	$scope.game = new Game(0, "Game_0");
	
});