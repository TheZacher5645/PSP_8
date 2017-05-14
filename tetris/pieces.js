function Piece(typeNumber) {
	if (typeNumber != undefined) {
		this.typeNumber = typeNumber
	} else {
		this.typeNumber = floor(random(pieces.length));
	}
	//this.typeNumber = 6;
	this.type = pieces[this.typeNumber];
	if (typeof(pieces[this.typeNumber][0][0]) != "number") {
		this.type = this.type[0]
	}
	
	this.x = ceil(10/2 - this.type[0].length/2);

	this.y = 0;

	this.new = true

	function allZero(piece) {
		var zero = true;
		for (var i = 0; i < piece.type[0].length; i++) {
			if (piece.type[-piece.y][i] != 0) {
				zero = false;
			}
		}
		return zero;
	}
	
	while (allZero(this)) {
		this.y--;
	}

	this.show = function(canvas) {
		for (var x = 0; x < this.type[0].length; x++) {
			for (var y = 0; y < this.type.length; y++) {
				if (this.type[y][x] != 0) {
					var color = colors[level % 10][this.type[y][x]-1];
					fill(color[0], color[1], color[2]);
					stroke(0,0,0);
					if (canvas == undefined) {
						rect(this.x*vscale + x*vscale, this.y*vscale + y*vscale, vscale-1, vscale-1);
					} else {
						canvas.fill(color[0], color[1], color[2]);
						canvas.rect(this.x*vscale + x*vscale, this.y*vscale + y*vscale, vscale-1, vscale-1);
					}
				}
			}
		}
	}

	this.move = function(dir) {
		this.x += dir;
		if (pileCollide(this)) {
			this.x -= dir;
		}
	}

	this.collide = function() {
		for (var x = 0; x < this.type[0].length; x++) {
			for (var y = 0; y < this.type.length; y++) {
				if (this.x + x < 0) {
					while (colliding(this)) {
						this.x++;
					}
				}
				if (this.x + x >= 10) {
					while (colliding(this)) {
						this.x--;
					}
				}
				if (this.y + y >= 20 && this.type[y][x] != 0) {
					place(this);
				}
			}
		}
		while (colliding(this)) {
			place(this);
		}
	}

	this.rotate = function (dir) {
		if (typeof(pieces[this.typeNumber][0][0]) == "number") {
			var temp = [];
			for(var x = 0; x < this.type[0].length; x++) {
				temp[x] = [];
				for(var y = 0; y < this.type.length; y++) {
					temp[x][y] = 0;
				}
			}

			for (var x = 0; x < this.type[0].length; x++) {
				for (var y = 0; y < this.type.length; y++) {
					temp[x][y] = this.type[y][x];
				}
			}
			this.type = temp;

			if (dir == -1) {
				for (var i = 0; i < this.type.length; i++) {
					this.type.reverse();
				}
			}

			if (dir == 1) {
				for (var i = 0; i < this.type[0].length; i++) {
					this.type[i].reverse();
				}
			}
		} else {
			if (pieces[this.typeNumber][0] == this.type) {
				this.type = pieces[this.typeNumber][1]
			} else {
				this.type = pieces[this.typeNumber][0]
			}
		}
	}
}