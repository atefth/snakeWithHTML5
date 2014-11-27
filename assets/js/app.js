var COLS = 10, ROWS = 10;
var HEIGHT = 40, WIDTH = 40;
var MARGIN = 5, PADDING = 5;

var SNAKE = 1, EMPTY = 0, FOOD = 2;
var DIRECTION;

var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39;

var canvas = document.getElementById("stage");
var context = canvas.getContext("2d");

//Grid Object
var grid = {
	_grid: [[]],
	cols: 5,
	rows: 5,
	init: function (cols, rows, value) {
		this.cols = cols;
		this.rows = rows;
		for (var i = 0; i < ROWS; i++) {
			this._grid[i] = [];
			for (var j = 0; j < ROWS; j++) {
				this._grid[i][j] = [];
				this._grid[i][j][0] = value;
				this._grid[i][j][1] = 0;
			}
		}
	},
	set: function (x, y, value, direction) {
		this._grid[x][y][0] = value;
		this._grid[x][y][1] = direction;
	},
	get: function (x, y) {
		return this._grid[x][y];
	},
	clear: function (x, y) {
		console.log("clearing : ["+x+", "+y+"]");
		this._grid[x][y][0] = EMPTY;
		this._grid[x][y][1] = 0;
	},
	direct: function (x, y, direction) {
		this._grid[x][y][1] = direction;
	}
}

//Reference to the Head
var head = {
	x: null,
	y: null,
	init: function (x, y, dir) {
		this.x = x;
		this.y = y;
		grid.set(x, y, SNAKE, dir);
	},
	get: function () {
		return grid.get(this.x, this.y);
	},
	set: function (node, dir) {
		this.x = node.x;
		this.y = node.y;
		grid.set(this.x, this.y, SNAKE, dir);
	},
	direction: function () {
		return grid.get(this.x, this.y)[1];
	},
	direct: function (direction) {
		grid.direct(this.x, this.y, direction);
	}
}

//Reference to the Tail
var tail = {
	x: null,
	y: null,
	init: function (x, y, dir) {
		this.x = x;
		this.y = y;
		grid.set(x, y, SNAKE, dir);
	},
	get: function () {
		return grid.get(this.x, this.y);
	},
	set: function (node) {
		this.x = node.x;
		this.y = node.y;
	},
	direction: function () {
		return grid.get(this.x, this.y)[1];
	},
	clear: function () {
		grid.clear(this.x, this.y);
	},
	shift: function (x, y) {
		this.x = x;
		this.y = y;
	}
}

//Reference to the Next point
var next = {
	x: null,
	y: null,
	init: function (x, y) {
		this.x = x;
		this.y = y;
	},
	get: function () {
		return grid.get(this.x, this.y);
	},
	set: function (x, y) {
		this.x = x;
		this.y = y;
	}
}

//Snake Object
var snake = {
	size: 0,
	direction: 0,
	init: function (size, direction) {
		this.size = size;
		this.direction = direction;
	},
	move: function () {
		if (next.get()[0] == FOOD) {
			this.grow();
		}else if(next.get()[0] == SNAKE){

		}else if (this.size == 1) {
			head.set(next, this.direction);
			this.updateNext();
			tail.clear();
			tail.set(head);
		}else{
			console.log("head : [" + head.x + ", " + head.y + "]");
			head.set(next, this.direction);
			console.log("updated head : [" + head.x + ", " + head.y + "]");
			this.updateNext();
			var x = tail.x, y = tail.y, dir = tail.direction();
			console.log("direction :" + dir);
			switch(dir){
				case UP:
					y--;
					break;
				case DOWN:
					y++;
					break;
				case LEFT:
					x--;
					break;
				case RIGHT:
					x++;
					break;
			}
			if (x < 0) {
				x = grid.cols - 1;
			}else if(x >= grid.cols){
				x = 0;
			}
			if (y < 0) {
				y = grid.rows - 1;
			}else if(y >= grid.rows){
				y = 0;
			}
			tail.clear();
			tail.shift(x, y);
		}
	},
	change: function (direction) {
		this.direction = direction;
		head.direct(direction);
		this.updateNext();
	},
	grow: function () {
		console.log("growing");
		console.log("head : [" + head.x + ", " + head.y + "]");
		head.set(next, this.direction);
		console.log("updated head : [" + head.x + ", " + head.y + "]");
		this.updateNext();
		this.size++;
		resetFood();
		console.log("tail : [" + tail.x + ", " + tail.y + "]");
	},
	updateNext: function () {		
		var x = head.x;		
		var y = head.y;
		switch(this.direction){
			case UP:
				y--;
				break;
			case DOWN:
				y++;
				break;
			case LEFT:
				x--;
				break;
			case RIGHT:
				x++;
				break;
		}
		if (x < 0) {
			x = grid.cols - 1;
		}else if(x >= grid.cols){
			x = 0;
		}
		if (y < 0) {
			y = grid.rows - 1;
		}else if(y >= grid.rows){
			y = 0;
		}
		next.set(x, y);
	}
}

function resetFood () {
	var x = 0;
	var y = 0;
	while (grid.get(x, y)[0] != EMPTY) {
		x = Math.floor(Math.random() * grid.cols);
		y = Math.floor(Math.random() * grid.rows);
	}
	grid.set(x, y, FOOD, 0);
}

function init (cols, rows, value, direction) {
	grid.init(cols, rows, value);
	DIRECTION = direction;
	head.init(2, 7, DIRECTION);
	tail.init(2, 7, DIRECTION);
	next.init(2, 6);
	snake.init(1, DIRECTION);
	resetFood();
	window.addEventListener("keydown", listener);
	setInterval(function () {
		loop();
	}, 200);
}

function loop () {
	draw();
	snake.move();
}

function listener (event) {
	var key = event.keyCode;
	switch(key){
		case UP:
			DIRECTION = UP;
			snake.change(DIRECTION);			
			break;
		case DOWN:
			DIRECTION = DOWN;
			snake.change(DIRECTION);
			break;
		case LEFT:
			DIRECTION = LEFT;
			snake.change(DIRECTION);
			break;
		case RIGHT:
			DIRECTION = RIGHT;
			snake.change(DIRECTION);
			break;
	}
}

init(COLS, ROWS, EMPTY, UP);

function draw () {
	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			if (grid.get(i, j)[0] == EMPTY) {
				this.context.fillStyle = "#666";
				this.context.fillRect((i * WIDTH)+(i * MARGIN),(j * HEIGHT)+(j * MARGIN), HEIGHT, WIDTH);
			}else if (grid.get(i, j)[0] == SNAKE) {
				this.context.fillStyle = "#ABA";
				this.context.fillRect((i * WIDTH)+(i * MARGIN),(j * HEIGHT)+(j * MARGIN), HEIGHT, WIDTH);
			}else if (grid.get(i, j)[0] == FOOD) {
				this.context.fillStyle = "#111";
				this.context.fillRect((i * WIDTH)+(i * MARGIN),(j * HEIGHT)+(j * MARGIN), HEIGHT, WIDTH);
			}
		}
	}
}