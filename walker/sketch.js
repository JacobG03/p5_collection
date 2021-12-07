function setup() {
	createCanvas(windowWidth, windowHeight);
	// put setup code here
	background(0)
	frameRate(60)
	walkers = []
	for (let i = 0; i < 5; i++) {
		w = new Walker(width / 2, height / 2, "#" + ((1<<24)*Math.random() | 0).toString(16))
		walkers.push(w)
	}
}


class Walker {
	constructor(x, y, clr) {
		this.x = x;
		this.y = y;
		this.width = 4
		this.height = 4
		this.clr = clr
	}
	
	walk() {
		let decision = Math.floor(Math.random() * 10)
		let distance = Math.floor(Math.random() * 10)
		if (decision > 7.5) {
			this.x += distance
		} else if (decision > 5) {
			this.x -= distance
		} else if (decision > 2.5) {
			this.y += distance
		} else {
			this.y -= distance
		}
		distance = Math.floor(Math.random() * 10)
		return
	}
	
	teleport() {
		if (this.x >= width) {
			return true
		} else if (this.x <= 0) {
			return true
		} else if (this.y >= height) {
			return true
		} else if (this.y <= 0) {
			return true
		}
		return false
	}

	display() {
		strokeWeight(0)
		fill(this.clr)
		ellipse(this.x, this.y, this.width, this.height)
	}
}

function draw() {
	// put drawing code here
	for(let i = 0; i < walkers.length; i++) {
		walkers[i].walk()
		if (walkers[i].teleport()) {
			walkers[i].x = width / 2;
			walkers[i].width += 1
			walkers[i].height += 1
			walkers.append(new Walker(width / 2, height / 2, walkers[i].clr))
		}
		walkers[i].display()
	}
}
