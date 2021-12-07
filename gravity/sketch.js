const bgColor = 0
const squares_amount = 100
var fall = true


function setup() {
	createCanvas(800, 800);
	background(bgColor)
	frameRate(60)

	squares = []
	for (let i = 0; i < squares_amount; i++) {
		let square = new BouncingSquare(width, 100)
		this.squares.push(square)
	}
}

function draw() {
	background(bgColor)
	if (keyIsPressed === true) {
		if (keyCode === 32) {
			fall = false
		}
  } else {
    fall = true
  }
	for (let i = 0; i < squares.length; i++) {
		squares[i].display()
		squares[i].fall()
	}
}

class BouncingSquare {
	constructor(x, y) {
		this.x = randomInteger(0, x)
		this.y = randomInteger(0, y)
		this.width = randomInteger(0, 128)
		this.speed = 0
		this.gravity = randomInteger(1, 5) / 10
		this.color = color(randomInteger(0, 255), randomInteger(0, 255), randomInteger(0, 255))
	}

	display() {
		fill(this.color)
		stroke(2)
		rectMode(CENTER);
		square(this.x, this.y, this.width)
	}

	fall() {
		// direction => down
		if (fall) {
			this.y += this.speed;
			this.speed += this.gravity;
		} else {
			// direction => up
			this.y -= (this.speed / 2);
			this.speed += (this.gravity / 10);
		}
		// if square is on the edge
		if (this.y > (height - this.width / 2)) {
			// reduce speed
			this.speed *= -0.9;
			// fix height
			this.y = height - (this.width / 2);
			// reduce square width
			this.width -= (this.width * 0.2)
			if (this.width < 1) {
				// delete square
				squares = squares.filter(square => square !== this)
			}
		} else if (this.y < (this.width / 2)) {
			// if square is too high, fix y
			this.y = (this.width / 2)
		}
	}
}

function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}