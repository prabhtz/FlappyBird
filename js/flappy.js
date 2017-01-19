(function(){


function getRandom(min, max) {
	return Math.floor(Math.random() * (max-min+1) + min);
}

function getRandomX(min, max) {
	var temp = [];
	temp[0] = getRandom(300, 400);
	temp[1] = getRandom(501, 600);
	temp[2] = getRandom(701, 800);
	return temp[getRandom(0,2)];
}

function Pipe() {
	var score = 0;
	this.x = 600;
	this.y = 0;
	this.dx = -1;
	this.height = 0;
	this.element;

	this.init = function() {
		this.element = document.createElement("div");
		this.element.setAttribute("class", "pipe");

		document.getElementById("container").appendChild(this.element);	
		this.draw();
	}

	this.draw = function() {
		this.element.style.top = this.y + "px";
		this.element.style.left = this.x + "px";
		this.element.style.height = this.height + "px";
	}

	this.removeElement = function() {
		this.element.remove();
	}
}

function Bird() {
	this.birdElement;
	this.y = 275;
	this.x = 150;
	var that = this;
	var gravity = 0;

	this.init = function() {
		this.birdElement = document.createElement("div");
		this.birdElement.setAttribute("id", "bird");
		this.birdElement.style.top = this.y + "px";
		this.birdElement.style.left = this.x + "px";

		document.getElementById("container").appendChild(this.birdElement);
		document.onkeydown = fly;
	}

	this.fall = function() {
		gravity ++;
		this.y += 3;
		if (gravity > 10) {
			this.y += 2;
		}
		if (gravity > 20) {
			this.y += 3;
		}

		this.birdElement.style.top = this.y + "px";
	}

	function fly(event) {
		console.log(event.keyCode);
		if (event.keyCode == 32) {
			gravity = 0;
			that.y -= 50;
			that.birdElement.style.top = that.y + "px";
		}
	}
}

function PipeMove() {
	var pipes = [];
	var i = 0;
	var counter = 0;
	var bird = new Bird();
	var score = 0;
	var intervalId;
	var totalScore = 0;

	this.createBackground = function() {
		this.bG = document.createElement("div");
		this.bG.setAttribute("id", "background");

		document.getElementById("container").appendChild(this.bG);
	}

	this.createScoreBoard = function() {
		this.scoreBoard = document.createElement("div");
		this.scoreBoard.setAttribute("id", "scoreDiv");
		this.scoreBoard.innerHTML = "Score : 0";

		document.getElementById("container").appendChild(this.scoreBoard);
	}


	this.init = function() {
		this.createBackground();
		this.createScoreBoard();
		bird.init();
		intervalId = setInterval(run,50);
		// checkOverlap(pipe,i);
	}

	var run = function () {
		counter++;
		if ((counter % 100) == 0) {
			create();
		}
		bird.fall();
		moveBg();
		move();
		check();
		birdWall();
	}

	var create = function () {
		var pipe1 = new Pipe();
		var pipe2 = new Pipe();
		var pipe1Height = getRandom(1,300);
		pipe1.height = pipe1Height;
		pipe2.y = pipe1Height + 100;
		pipe2.height = 600 - (pipe1Height + 100);

		pipe1.init();
		pipe2.init();

		pipes.push(pipe1);
		pipes.push(pipe2);
	}

	var move = function() {
			
		for (var i=0; i<pipes.length; i++) {
			var pipe = pipes[i];
			pipe.x -= 5;
			pipe.draw();
			checkCollision(i);
		}
			
	}

	function check() {
		for (var i=0; i<pipes.length; i++) {
			if (pipes[i].x + 50 <= 0) {
				pipes[i].removeElement();
				pipes.shift();
			}
		}
	}

	// function checkOverlap(pipe, pos) {
	// 	if (pipesUpper.length >= 2) {
	// 		for (var i=0; i<pipesUpper.length-1; i++) {
	// 			if (i==pos) {
	// 				i++;
	// 			}
	// 			if ((pipe.x < (pipesUpper[i].x + 350)) && ((pipe.x + 350) > pipesUpper[i].x)) {
	// 				if (pipe.x > pipesUpper[i].x) {
	// 					var diff = pipe.x - (50 + pipesUpper[i].x);
	// 					if (diff < 0) {
	// 						pipe.x += (300 + Math.abs(diff));
	// 					} else {
	// 						pipe.x += (300 - Math.abs(diff));
	// 					}
	// 				} else {
	// 					var diff = pipe.x - pipesUpper[i].x;
	// 					if (diff <= 50) {
	// 						pipe.x += (300 + Math.abs(diff));
	// 					} else {
	// 						pipesUpper[i].x += (300 - Math.abs(diff));
	// 					}
	// 				}
	// 				// console.log(pipe.x);
					
	// 			}
	// 		}
	// 		// pipe.draw();
	// 	}
	

	function checkCollision(pos) {
		if (i != pos) {
			for (var i=0; i<pipes.length; i++) {
				if (((bird.x < (pipes[i].x + 50)) && ((bird.x + 30) > pipes[i].x) && 
				(bird.y < (pipes[i].y + pipes[i].height)) && ((30 + bird.y) > pipes[i].y))) {
					console.log("collision detected");
					restartGame();
				}
				else {
					if (bird.x == pipes[i].x){
						totalScore = document.getElementById("scoreDiv");
						score++;
						totalScore.innerHTML = "Score : " + Math.floor(score/4);
						console.log(score);
					}
					console.log(score/4);
				}
			}
		}
		
	} 

	function restartGame() {
		// var contain = document.getElementById("container");
		// var scoreDiv = document.getElementById("scoreDiv");
		// var birdDiv = document.getElementById("bird");
		// var pipeDiv = document.getElementsByClassName("pipe");
		
		
		// for (var i=0; i<pipeDiv.length; i++) {
		// 	contain.removeChild(pipeDiv[i]);
		// }
		// contain.removeChild(birdDiv);
		clearInterval(intervalId);
		score = 0;
		counter = 0;
		i = 0;
		delete pipemove;
		delete bird;
		pipes = [];
		document.getElementById("container").innerHTML = "Game Over"+"<br>"+"Press any key to restart......";

		var restart = function(event) {
			if (event.keyCode) {
				clearInterval(intervalId);
				delete pipemove;
				document.getElementById("container").innerHTML = ""; 
				startGame();
			}
		}
		document.onkeydown = restart;
	}



	function moveBg() {
		var background = document.getElementById("background");
		var margin = parseInt(getComputedStyle(background).getPropertyValue("margin-left"));
		margin = margin - 1;
		background.style = "margin-left : " + margin + "px;";
	}

	function birdWall() {
		if (bird.y <= 0 || bird.y + 30 >= 600){
			restartGame();
		}
	}
}

var pipemove = new PipeMove();

function startGame() {
	pipemove = new PipeMove();
	pipemove.init();
}

startGame();

})();
