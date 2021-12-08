// Global
const UP = 0
const RIGHT = 1
const DOWN = 2
const LEFT = 3

const Config = {
	DUMMIES_AMOUNT: 5,
	Player: {
		width: 32,
		speed: 4,
		sprint: 2
	},
	Gun: {
		fireRate: 100,
		range: 1000
	},
	Bullet: {
		color: 'rgba(0, 0, 200, 0.5)',
		height: 8,
		width: 2,
		speed: 16,
		damage: 20
	},
	Dummy: {
		width: 48,
		health: 100,
		color: 0
	}
}

const User = {
	username: 'Jacob',
	avatar: 'https://i.kym-cdn.com/photos/images/original/000/579/858/0e2.jpg',
	id: 1
}

let avatar;
let game;

function preload() {
  avatar = loadImage(User.avatar);
}

function setup() {
	createCanvas(800, 800);
	frameRate(60)
	game = new Game()
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
	// handle dummies
	if (game.dummies.length > 0) {
		for (let i = 0; i < game.dummies.length; i++) {
			let dummy = game.dummies[i]
			dummy.display()
		}
	} else {
		for (let i = 0; i < randomInteger(5, 20); i++) {
			let dummy = new Dummy(randomInteger(0, width), randomInteger(0, height))
			game.dummies.push(dummy)
		}
	}
	textSize(32);
	text(game.players[0].kills, 10, 30);
	game.checkForCollisions()
}

class Game {
	constructor() {
		this.players = []
		this.bullets = []
		this.dummies = []

		this.loadPlayers()
		this.loadDummies()
	}

	loadPlayers() {
		let player = new Player(width / 2, height / 2, User)
		this.players.push(player)
	}

	loadDummies() {
		for (let i = 0; i < Config.DUMMIES_AMOUNT; i++) {
			let dummy = new Dummy(randomInteger(0, width), randomInteger(0, height))
			this.dummies.push(dummy)
		}
	}

	checkForCollisions() {
		this.validateBulletBoundries()
		this.validatePlayersBoundries()
		this.validateBullets()
	}

	validateBullets() {
		for (let i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i]
			for (let j = 0; j < this.dummies.length; j++) {
				let dummy = this.dummies[j]
				if (validCollision(bullet, dummy)) {
					dummy.gotHit(bullet)
				}
			}
		}
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
		this.kills = 0
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
	constructor(player) {
		this.player = player
		this.canShoot = true
		this.fireRate = Config.Gun.fireRate // can shoot every 400ms
	}

	shoot(direction) {
		if (this.canShoot) {
			let bullet = new Bullet(direction, this.player)
			game.bullets.push(bullet)
			this.canShoot = false
			setTimeout(() => {
				this.canShoot = true
			}, this.fireRate)
		}
	}
}

class Bullet {
	constructor(direction, player) {
		this.x = player.x + player.width / 2
		this.y = player.y + player.width / 2
		this.direction = direction
		this.damage = Config.Bullet.damage
		this.width = Config.Bullet.width
		this.height = Config.Bullet.height
		this.speed = Config.Bullet.speed
		this.distance = 0
		this.player = player
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

class Dummy {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.width = Config.Dummy.width
		this.height = this.width
		this.health = Config.Dummy.health
		this.color = Config.Dummy.color
	}

	gotHit(bullet) {
		this.health -= bullet.damage
		this.color += bullet.damage
		bullet.remove()
		if (this.health <= 0) {
			bullet.player.kills += 1
			this.remove()
		}
	}

	remove() {
		game.dummies = game.dummies.filter(dummy => dummy !== this)
	}

	display() {
		fill(this.color)
		rectMode(CENTER)
		square(this.x, this.y, this.width)
	}
}

const validCollision = (first, second) => {
	if (abs(first.x - second.x) <= second.width / 2 && abs(first.y - second.y) <= second.height / 2) {
		return true
	}
	return false
}

// Helper functions
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}