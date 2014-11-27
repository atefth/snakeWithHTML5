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
	_grid: null,
	cols: null,
	rows: null,
	value: null,
	init: function (cols, rows, value) {
		this._grid = [[]];
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
	}
}

//Reference to the Head
var head = {
	x: null,
	y: null,
	init: function (x, y) {
		this.x = x;
		this.y = y;
	},
	getX: function () {
		return this.x;
	},
	getY: function () {
		return this.y;
	},
	set: function (x, y) {
		this.x = x;
		this.y = y;
	}
}

//Reference to the Tail
var tail = {
	x: null,
	y: null,
	init: function (x, y) {
		this.x = x;
		this.y = y;
	},
	getX: function () {
		return this.x;
	},
	getY: function () {
		return this.y;
	},
	set: function (x, y) {
		this.x = x;
		this.y = y;
	}
}

function init (cols, rows, value) {
	grid.init(cols, rows, value);
	DIRECTION = DOWN;
	head.init(2,7);
	tail.init(2,7);
	grid.set(2,7,SNAKE, DIRECTION);
	window.addEventListener("keydown", listener);
	setInterval(function () {
		loop();
	}, 500);
}

function listener (event) {
	var key = event.keyCode;
	switch(key){
		case UP:
			DIRECTION = UP;
			break;
		case DOWN:
			DIRECTION = DOWN;
			break;
		case LEFT:
			DIRECTION = LEFT;
			break;
		case RIGHT:
			DIRECTION = RIGHT;
			break;
	}
}

function loop () {
	switch(DIRECTION){
		case UP:
			moveUp();
			break;
		case DOWN:
			moveDown();
			break;
		case LEFT:
			moveLeft();
			break;
		case RIGHT:
			moveRight();
			break;
	}
	draw();
}

init(COLS, ROWS, EMPTY);

function draw () {
	for (var i = 0; i < ROWS; i++) {
		for (var j = 0; j < COLS; j++) {
			if (grid.get(i, j)[0] == EMPTY) {
				this.context.fillStyle = "#666";
				this.context.fillRect((i * WIDTH)+(i * MARGIN),(j * HEIGHT)+(j * MARGIN), HEIGHT, WIDTH);
			}
			if (grid.get(i, j)[0] == SNAKE) {
				this.context.fillStyle = "#ABA";
				this.context.fillRect((i * WIDTH)+(i * MARGIN),(j * HEIGHT)+(j * MARGIN), HEIGHT, WIDTH);
			}
		}
	}
}

function wrapUp (node) {
	if (node.getY() - 1 < 0) {
		return true;
	}else{
		return false;
	}
}

function wrapDown (node) {
	if (node.getY() + 1 >= ROWS) {
		return true;
	}else{
		return false;
	}
}

function wrapLeft (node) {
	if (node.getX() - 1 < 0) {
		return true;
	}else{
		return false;
	}
}

function wrapRight (node) {
	if (node.getX() + 1 >= COLS) {
		return true;
	}else{
		return false;
	}
}

function shift (node) {
	switch(node[1]){
			case UP:
				if (wrapUp(tail)) {
					tail.set(tail.getX(), ROWS - 1);
				}else{
					tail.set(tail.getX(), tail.getY() - 1);
				}
				node[0] = EMPTY;
				node[1] = 0;
				break;
			case DOWN:
				if (wrapDown(tail)) {
					tail.set(tail.getX(), 0);
				}else{
					tail.set(tail.getX(), tail.getY() + 1);
				}
				node[0] = EMPTY;
				node[1] = 0;
				break;
			case LEFT:
				if (wrapLeft(tail)) {
					tail.set(COLS - 1, tail.getY());
				}else{
					tail.set(tail.getX() - 1, tail.getY());
				}
				node[0] = EMPTY;
				node[1] = 0;
				break;
			case LEFT:
				if (wrapRight(tail)) {
					tail.set(0, tail.getY());
				}else{
					tail.set(tail.getX() + 1, tail.getY());
				}
				node[0] = EMPTY;
				node[1] = 0;
				break;
		}
}

function moveUp () {
	var nextPos;
	var x = head.getX();
	var y;
	if (wrapUp(head)) {
		y = ROWS - 1;
		nextPos = grid.get(x, y);
	}else{
		y = head.getY() - 1;
		nextPos = grid.get(x, y);
	}
	if (nextPos[0] == FOOD) {

	}else if(nextPos[0] == SNAKE){

	}else{
		nextPos[0] = SNAKE;
		nextPos[1] = UP;
		head.set(x, y);
		var lastPos = grid.get(tail.getX(), tail.getY());
		shift(lastPos);
	}
}

function moveDown () {
	var nextPos;
	var x = head.getX();
	var y;
	if (wrapDown(head)) {
		y = 0;
		nextPos = grid.get(x, y);
	}else{
		y = head.getY() + 1;
		nextPos = grid.get(x, y);
	}
	if (nextPos[0] == FOOD) {

	}else if(nextPos[0] == SNAKE){

	}else{
		nextPos[0] = SNAKE;
		nextPos[1] = DOWN;
		head.set(x, y);
		var lastPos = grid.get(tail.getX(), tail.getY());
		shift(lastPos);
	}
}

function moveLeft () {
	var nextPos;
	var x;
	var y = head.getY();
	if (wrapLeft(head)) {
		x = COLS - 1;
		nextPos = grid.get(x, y);
	}else{
		x = head.getX() - 1;
		nextPos = grid.get(x, y);
	}
	if (nextPos[0] == FOOD) {

	}else if(nextPos[0] == SNAKE){

	}else{
		nextPos[0] = SNAKE;
		nextPos[1] = LEFT;
		head.set(x, y);
		var lastPos = grid.get(tail.getX(), tail.getY());
		shift(lastPos);
	}
}

function moveRight () {
	var nextPos;
	var x;
	var y = head.getY();
	if (wrapRight(head)) {
		x = 0;
		nextPos = grid.get(x, y);
	}else{
		x = head.getX() + 1;
		nextPos = grid.get(x, y);
	}
	if (nextPos[0] == FOOD) {

	}else if(nextPos[0] == SNAKE){

	}else{
		nextPos[0] = SNAKE;
		nextPos[1] = RIGHT;
		head.set(x, y);
		var lastPos = grid.get(tail.getX(), tail.getY());
		shift(lastPos);
	}
}