// Global
const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

const Config = {
	Player: {
		width: 32,
		speed: 4,
		sprint: 2
	},
	Gun: {
		fireRate: 50,
		range: 2000
	},
	Bullet: {
		color: 'rgba(0, 0, 200, 0.5)',
		height: 60,
		width: 10,
		speed: 6,
	}
}

const User = {
	username: 'Jacob',
	avatar: 'https://i.kym-cdn.com/photos/images/original/000/579/858/0e2.jpg',
	id: 1
}

let avatar;
let game;

const gameInit = () => {
	let player = new Player(width / 2, height / 2, User)
	game = new Game()
	game.players.push(player)
}

function preload() {
  avatar = loadImage(User.avatar);
}

function setup() {
	createCanvas(800, 800);
	gameInit()
	frameRate(60)
}

function draw() {
	background(160)
	// handle bullets
	for (let i = 0; i < game.bullets.length; i++) {
		let bullet = game.bullets[i]
		bullet.fly()
		bullet.display()
	}
	// handle players
	for (let i = 0; i < game.players.length; i++) {
		let player = game.players[i]
		if (keyIsPressed) {
			player.movement()
			player.attack()
		}
		player.display()
	}

	game.checkForCollisions()
}

class Game {
	constructor() {
		this.players = []
		this.bullets = []
	}

	checkForCollisions() {
		this.validateBulletBoundries()
		this.validatePlayersBoundries()
	}

	validatePlayersBoundries() {
		for (let i = 0; i < this.players.length; i++) {
			let player = this.players[i]
			// check horizontally
			// top
			if (player.x < 0) {
				player.x = width - player.width
				// bottom
			} else if (player.x + player.width > width) {
				player.x = 0
			// check vertically
				// left
			} else if (player.y < 0) {
				player.y = height - player.width
				// right
			} else if (player.y + player.width > height) {
				player.y = 1
			}
		}
	}

	validateBulletBoundries() {
		for (let i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i]
			// check horizontally
			// top
			if (bullet.x < 0) {
				bullet.x = width - bullet.width
				// bottom
			} else if (bullet.x + bullet.width > width) {
				bullet.x = 0
			// check vertically
				// left
			} else if (bullet.y < 0) {
				bullet.y = height - bullet.width
				// right
			} else if (bullet.y + bullet.width > height) {
				bullet.y = 1
			}
		}
	}
}

class Player {
	constructor(x, y, user) {
		this.x = x
		this.y = y
		this.speed = Config.Player.speed
		this.walk_speed = this.speed
		this.sprint_speed = this.speed * Config.Player.sprint
		this.width = Config.Player.width;
		this.user = user
		this.weapon = 0
		this.weapons = [new Gun(this)]
		this.avatar = () => image(avatar, this.x, this.y, this.width, this.width);
	}

	movement() {
		// up
		if (keyIsDown(87)) {
			this.y -= this.walk_speed
			// down
		} else if(keyIsDown(83)) {
			this.y += this.walk_speed
		}
		// left
		if (keyIsDown(65)) {
			this.x -= this.walk_speed
		} else if (keyIsDown(68)) {
			// right
			this.x += this.walk_speed
		}
		// sprint
		if (keyIsDown(16)) {
			this.walk_speed = this.sprint_speed
		} else {
			this.walk_speed = this.speed
		}
	}

	attack() {
		// if arrow key pressed
		if (keyIsDown(37)) {
			let gun = this.weapons[this.weapon];
			let direction = LEFT
			gun.shoot(direction)
		} else if(keyIsDown(38)) {
			let gun = this.weapons[this.weapon];
			let direction = UP
			gun.shoot(direction)
		} else if(keyIsDown(39)) {
			let gun = this.weapons[this.weapon];
			let direction = RIGHT
			gun.shoot(direction)
		} else if(keyIsDown(40)) {
			let gun = this.weapons[this.weapon];
			let direction = DOWN
			gun.shoot(direction)
		} 
	}

	display() {
		this.avatar()
	}
}

class Gun {
	constructor(user) {
		this.user = user
		this.canShoot = true
		this.fireRate = Config.Gun.fireRate // can shoot every 400ms
	}

	shoot(direction) {
		if (this.canShoot) {
			let bullet = new Bullet(direction, this.user)
			game.bullets.push(bullet)
			this.canShoot = false
			setTimeout(() => {
				this.canShoot = true
			}, this.fireRate)
		}
	}
}

class Bullet {
	constructor(direction, user) {
		this.x = user.x + user.width / 2
		this.y = user.y + user.width / 2
		this.direction = direction
		this.width = Config.Bullet.width
		this.height = Config.Bullet.height
		this.speed = Config.Bullet.speed
		this.distance = 0
		this.user = user
		this.color = Config.Bullet.color
	}

	fly() {
		if (this.direction === UP) {
			this.y -= this.speed
		} else if (this.direction === DOWN) {
			this.y += this.speed
		} else if (this.direction === RIGHT) {
			this.x += this.speed
		} else if (this.direction === LEFT) {
			this.x -= this.speed
		}
		this.distance += this.speed

		if (this.distance > Config.Gun.range) {
			this.remove()
		}
	}

	remove() {
		game.bullets = game.bullets.filter(bullet => bullet !== this)
	}

	display() {
		fill(this.color)
		rectMode(CENTER)
		if (this.direction === UP || this.direction === DOWN) {
			rect(this.x, this.y, this.width, this.height)
		} else {
			rect(this.x, this.y, this.height, this.width)
		}
	}
}
