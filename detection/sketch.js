function setup() {
	// Init
	bgColor = 255
	fps = 60
	
	food = []
	fruit_width = 6
	fruit_height = 6
	
	eaters = []
	eater_amount = 400
	eater_width = 12
	eater_height = 12

	createCanvas(600, 600);
	background(bgColor)
	frameRate(fps)
}

function draw() {
	// at the beggining
	if (frameCount === 1) {
		for(let i = 0; i < eater_amount; i++) {
			let eater = new Eater()
			eater.display_self()
			eaters.push(eater)
		}
	}
	// every 5 seconds
	if (frameCount % 1 === 0) {
		let fruit = new Fruit()
		fruit.display_self()
		food.push(fruit)
	}
	// Every frame
	for (let i = 0; i < eaters.length; i++) {
		eaters[i].display_self()
		eaters[i].walk()
	}
}

class Fruit {
	constructor() {
		this.x = randomInteger(fruit_width, width - fruit_width)
		this.y = randomInteger(fruit_height, height - fruit_height)
		this.clr = color(0, 255, 0)
	}
	// by default when called display self
	// if argument given == false, color self as background color
	display_self(decision=true) {
		stroke(0)
		strokeWeight(1)
		fill(decision ? this.clr : bgColor)
		ellipse(this.x, this.y, fruit_width, fruit_height)
	}

	remove() {
		food = food.filter(fruit => fruit !== this)
	}
}

// speed up if food is in range
class Eater {
	constructor() {
		this.x = randomInteger(eater_width, width - eater_width)
		this.y = randomInteger(eater_height, height - eater_height)
		this.width = eater_width
		this.height = eater_height
		this.clr = color(randomInteger(40, 255), randomInteger(40, 255), randomInteger(40, 255))
		this.movement = {
			x: 0,
			y: 0,
		}
		this.vision = 64
		this.eating = false
	}

	walk() {
		if (!this.eating) {
			this.look()
			if (this.movement.x !== 0 || this.movement.y !== 0) {
				this.hide_self()
				this.move()
				this.display_self()
			}
		}
	}

	move() {
		this.x = this.x += this.movement.x
		this.y = this.y += this.movement.y
	}

	look() {
		let nearest_fruit
		for (let i = 0; i < food.length; i++) {
			let distance = Math.abs(this.x - food[i].x) + Math.abs(this.y - food[i].y)
			if (nearest_fruit) {
				if (distance < Math.abs(this.x - nearest_fruit.x) + Math.abs(this.y - nearest_fruit.y)) {
					nearest_fruit = food[i]
				}
			} else {
				nearest_fruit = food[i]
			}
		}
		// calculate movement
		if (nearest_fruit) {
			if (this.x < nearest_fruit.x) {
				this.movement.x = 1
			} else if (this.x > nearest_fruit.x) {
				this.movement.x = -1
			} else {
				this.movement.x = 0
			}
			if (this.y < nearest_fruit.y) {
				this.movement.y = 1
			} else if (this.y > nearest_fruit.y) {
				this.movement.y = -1
			} else {
				this.movement.y = 0
			}
			
			if (this.movement.x === 0 && this.movement.y === 0) {
				this.eat(nearest_fruit)
			}
		}
	}

	eat(fruit) {
		if (this.x === fruit.x && this.y === fruit.y) {
			fruit.remove()

			this.width += 1
			this.height += 1
			this.eating = true
			setTimeout(() => {
				this.eating = false
			}, 1000)
		}
	}

	hide_self() {
		stroke(255)
		strokeWeight(1)
		fill(bgColor)
		ellipse(this.x, this.y, this.width + 2, this.height + 2)
	}

	display_self() {
		strokeWeight(0)
		fill(this.eating ? color(0,0,0) : this.clr)
		ellipse(this.x, this.y, this.width, this.height)
	}
}


function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}