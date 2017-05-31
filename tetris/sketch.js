// Code by Zander Stolfi
// http://github.com/TheZacher5645

var pieces = [
	[[0,0,0],
	 [1,1,1],
	 [0,1,0]],

	[[0,0,0],
	 [2,2,2],
	 [0,0,2]],

	[
		[[0,0,0],
		 [3,3,0],
		 [0,3,3]],
		 
		[[0,0,3],
		 [0,3,3],
		 [0,3,0]]
	 ],

	[[1,1],
	 [1,1]],

	[
		[[0,0,0],
		 [0,2,2],
		 [2,2,0]],

		[[0,2,0],
		 [0,2,2],
		 [0,0,2]]
	],

	[[0,0,0],
	 [3,3,3],
	 [3,0,0]],

	[
		[[0,0,0,0],
		 [0,0,0,0],
		 [1,1,1,1],
		 [0,0,0,0]],

		[[0,0,1,0],
		 [0,0,1,0],
		 [0,0,1,0],
		 [0,0,1,0]]
	]
];

var gameOver;
var totalLines;

function setup() {
	var vscale = 16;
	var player;
	var timeCount = 0;
	var timeInterval;
	var holdTimer = 0;
	var holdInterval = 10;
	var holdKey = null;
	var keyHeld = false;
	var gameOver = false;
	var nextType;
	var totalLines = 0;
	var score = 0;
	var prevLines = 0;
	var curLines = 0;
	var nClearLines = 0;
	var level = 0;
	var softDrop = false
	var pDown = false;
	var dropScore = 0;
	var fGameOver = false;
	var pile = [];
	for(var x = 0; x < 10; x++) {
		pile[x] = [];
		for(var y = 0; y < 20; y++) {
			pile[x][y] = 0;
		}
	}
	//pile[7][8] = 1;
	
	// for (var i = 0; i < 9; i++) {
	// 	for (var j = 16; j < 20; j++) {
	// 		pile[i][j] = 1;
	// 	}
	// }

	var colors = [
	[[255,255,255],
		 [66,64,255],
		 [100,176,255]],

		[[255,255,255],
		 [13,147,0],
		 [136,216,0]],

		[[255,255,255],
		 [160,26,204],
		 [242,106,255]],

		[[255,255,255],
		 [66,64,255],
		 [92,228,48]],

		[[255,255,255],
		 [183,30,123],
		 [69,224,130]],

		[[255,255,255],
		 [69,224,130],
		 [146,144,255]],

		[[255,255,255],
		 [181,49,32],
		 [102,102,102]],

		[[255,255,255],
		 [117,39,254],
		 [110,0,64]],

		[[255,255,255],
		 [66,64,255],
		 [181,49,32]],

		[[255,255,255],
		 [181,49,32],
		 [234,158,34]]
	];

	function showPile() {
		for (var x = 0; x < pile.length; x++) {
			for (var y = 0; y < pile[x].length; y++) {
				if (pile[x][y] != 0) {
					var color = colors[level % 10][pile[x][y]-1];
					stroke(0,0,0);
					fill(color[0], color[1], color[2]);
					rect(x*vscale, y*vscale, vscale-1, vscale-1);
				}
			}
		}
	}

	function fullRows() {
		var rows = [];
		for (var x = 0; x < pile[0].length; x++) {
			var clear = true;
			for (var y = 0; y < pile.length; y++) {
				if (pile[y][x] == 0) {
					clear = false;
				}
			}
			if (clear) {
				rows.push(x);
			}
		}
		return rows;
	}

	function removeRow(row) {
		for (var i = 0; i < 10; i++) {
			pile[i].splice(row, 1);
			pile[i].unshift(0);
		}
	}

	function colliding(piece) {
		var type = piece.type;
		var collision = false;
		for (var x = 0; x < type[0].length; x++) {
			for (var y = 0; y < type.length; y++) {
				if (type[y][x] != 0) {
					if (piece.x + x < 0) {
						collision = true;
					}
					if (piece.x + x >= 10) {
						collision = true;
					}
				}	
			}
		}
		return collision;
	}

	function pileCollide(piece) {
		var type = piece.type;
		var collision = false;
		for (var x = 0; x < type.length; x++) {
			for (var y = 0; y < type[x].length; y++) {
				if (type[y][x] != 0 && piece.x + x < 10 && piece.x + x >= 0) {
					if (piece.y < 0) {
						collision = false
					}
					if (pile[piece.x + x][piece.y + y] != 0) {
						collision = true;
						// console.log("collision!");
					}
				}	
			}
		}
		return collision;
	}

	function place(piece) {
		if (!gameOver) {
			for (var x = piece.x; x < piece.x + piece.type.length; x++) {
				for (var y = piece.y; y < piece.y + piece.type[x-piece.x].length; y++) {
					if (piece.type[y-piece.y][x-piece.x] != 0) {
						if (x < 10) {
							pile[x][y-1] = piece.type[y-piece.y][x-piece.x];
						}
					}
				}
			}
			player = new Piece(nextType.typeNumber);
			statValues[player.typeNumber]++;
			nextType = new Piece();
			nextType.x = 2 - nextType.type.length/2;
			if (nextType.typeNumber != 3) {
				nextType.y = 2 - ceil(nextType.type.length/2);
			} else {
				nextType.y = 2 - nextType.type.length/2;
			}
			if (nextType.typeNumber == 6) {
				nextType.y -= 0.5
			}
			holdTimer = 0;
			score += dropScore;
		}
	}

	function stop() {
		player.type = [0];
	}

	function lsScore(ls) {
		if (typeof(Storage) != "undefined") {	
			if (ls == "s") {
				localStorage.highScore = score;
			} else if (ls == "l") {
				return localStorage.highScore;
			}
		}
	}

	var nPG;
	var nPC;

	var canvas = createCanvas(vscale*10, vscale*20);
	canvas.parent("#playArea");
	
	nPG = createGraphics(64, 64);
	nPC = document.body.getElementsByTagName("CANVAS")[1];
	nPC.style.display = "inline";
	document.getElementById("nextPiece").appendChild(nPC);

	sG = createGraphics(48, 236);
	sC = document.body.getElementsByTagName("CANVAS")[2];
	sC.style.display = "inline";
	document.getElementById("statsPieces").appendChild(sC);
	statPieces = [];
	statValues = [];

	for (var i = 0; i < pieces.length; i++) {
		var piece = new Piece(i);
		piece.x = 0.5;
		if (i == 0) {
			piece.y = -0.5;
		} else if (i == 1) {
			piece.y = 2.25;
		} else if (i == 2) {
			piece.y = 5;
		} else if (i == 3) {
			piece.x = 1;
			piece.y = 8.75;
		} else if (i == 4) {
			piece.y = 10.5;
		} else if (i == 5) {
			piece.y = 13.5;
		} else if (i == 6) {
			piece.x = 0;
			piece.y = 15.5;
		}

		statPieces.push(piece);
		statValues.push(0);
	}

	player = new Piece();
	statValues[player.typeNumber]++;
	nextType = new Piece();

	nextType.x = 2 - nextType.type.length/2;
	if (nextType.typeNumber != 3) {
		nextType.y = 2 - ceil(nextType.type.length/2);
	} else {
		nextType.y = 2 - nextType.type.length/2;
	}
	if (nextType.typeNumber == 6) {
		nextType.y -= 0.5
	}

	if (typeof(Storage) == "undefined") {
		select("#warning").html("warning: high score feature won't work in your browser");
		select("#warning").style("display", "block");
	}
}

function draw() {
	background(0);

	level = floor(totalLines/10)

	if (lsScore("l") == undefined || lsScore("l") == null) {
		localStorage.highScore = 0;
	}

	if (level == 0) {
		timeInterval = 48;
	} else if (level == 1) {
		timeInterval = 43;
	} else if (level == 2) {
		timeInterval = 38;
	} else if (level == 3) {
		timeInterval = 33;
	} else if (level == 4) {
		timeInterval = 28;
	} else if (level == 5) {
		timeInterval = 23;
	} else if (level == 6) {
		timeInterval = 18;
	} else if (level == 7) {
		timeInterval = 13;
	} else if (level == 8) {
		timeInterval = 8;
	} else if (level == 9) {
		timeInterval = 6;
	} else if (level >= 10 && level <= 12) {
		timeInterval = 5;
	} else if (level >= 13 && level <= 15) {
		timeInterval = 4;
	} else if (level >= 16 && level <= 18) {
		timeInterval = 3;
	} else if (level >= 19 && level <= 28) {
		timeInterval = 2;
	} else if (level >= 29) {
		timeInterval = 1;
	}

	if (timeCount <= timeInterval-1) {
		timeCount++;
	} else {
		timeCount = 0;
		if (!gameOver) {
			player.y++;
			pDown = true;
		}
	}

	if (pileCollide(player)) {
		place(player);
	}

	curLines = fullRows().length;

	
	if (curLines != 0 && prevLines == 0) {
		nClearLines = fullRows().length;
	}

	totalLines += nClearLines;

	for (var i = 0; i < fullRows().length; i++) {
		removeRow(fullRows()[i]);
	}

	if (nClearLines == 1) {
		score += 40 * (level+1);
	} else if (nClearLines == 2) {
		score += 100 * (level+1);
	} else if (nClearLines == 3) {
		score += 300 * (level+1);
	} else if (nClearLines == 4) {
		score += 1200 * (level+1);
	}

	if (key == "") {
		key = null;
	}

	if (key != null) {
		if (holdKey == unchar(key.toUpperCase()) && holdTimer != holdInterval) {
			holdTimer++;
		}
	}

	if (holdTimer == holdInterval && keyIsPressed) {
		keyHeld = true;
	} else {
		keyHeld = false;
	}

	if (keyHeld == true) {
		if (holdKey == 40 || holdKey == 83) {
			softDrop = true;
			if (frameCount % 2 == 0) {
				pressKey(holdKey);
			}
		} else if ((holdKey == 39 || holdKey == 68 || holdKey == 37 || holdKey == 65) && frameCount % 4 == 0) {
			pressKey(holdKey);
			softDrop = false;
		} else {
			softDrop = false;
		}
	} else {
		softDrop = false;
	}

	if (softDrop && pDown) {
		dropScore++;
	} else if (player.y <= 0) {
		dropScore = 0;
	}

	if (player.new && pileCollide(player)) {
		fGameOver = true;
		gameOver = true;
	}

	nPG.background(0);
	nextType.show(nPG);

	sG.background(0);
	for (var i = 0; i < statPieces.length; i++) {
		statPieces[i].show(sG);
	}

	select("#lines").html(nf(totalLines, 3, 0));
	select("#score").html(nf(score, 6, 0));
	select("#level").html(nf(level, 2, 0));
	select("#top").html(nf(localStorage.highScore, 6, 0));
	for (var i = 0; i < statValues.length; i++) {
		select("#statsCount-"+ i).html(nf(statValues[i], 3, 0));
	}

	player.collide();
	stroke(0);
	strokeWeight(1);
	showPile();
	player.show();
	player.new = false;

	if (gameOver) {
		textSize(24);
		textAlign(CENTER, CENTER);
		fill(255);
		stroke(0);
		strokeWeight(8);
		text("Game Over", 0, 0, width, height);

		if (fGameOver && score > localStorage.highScore) {
			lsScore("s")
		}

		fGameOver = false;
	}

	prevLines = curLines;
	nClearLines = 0;
	pDown = false;
}

function pressKey(key) {
	if (!gameOver) {
		if (key == 39 || key == 68) {
			player.move(1);
		} else if (key == 37 || key == 65) {
			player.move(-1);
		} else if (key == 40 || key == 83) {
			timeCount = 0;
			player.y++;
			pDown = true;
			if (pileCollide(player)) {
				place(player);
			}
		} else if (key == 190 || key == 81) {
			player.rotate(-1);
			if (pileCollide(player) || colliding(player)) {
				player.rotate(1);
			}
		} else if (key == 191 || key == 69) {
			player.rotate(1);
			if (pileCollide(player) || colliding(player)) {
				player.rotate(-1);
			}
		}
	}

}

function keyPressed() {
	if (keyCode != 190 && keyCode != 81 && keyCode != 191 && keyCode != 69) {
		holdKey = keyCode;
	}
	pressKey(keyCode);
}

function keyReleased() {
	holdTimer = 0;
	keyHeld = false;
	holdKey = null;
}
