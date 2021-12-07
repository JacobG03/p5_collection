// Global
const FACE_UP = 0
const FACE_RIGHT = 1
const FACE_DOWN = 2
const FACE_LEFT = 3

const Config = {
	Player: {
		width: 64,
		speed: 2,
		sprint: 2
	},
	Bullet: {
		color: 'rgba(0, 0, 200, 0.5)',
		height: 20,
		width: 5,
		speed: 10,
	}
}

const User = {
	username: 'Jacob',
	avatar: 'https://i.kym-cdn.com/photos/images/original/000/579/858/0e2.jpg',
	id: 1
}

let avatar;
let gameMap
let players = []
let bullets = []

const gameInit = () => {
	let player = new Player(width / 2, height / 2, User)
	players.push(player)
	gameMap = new GameMap(0, 0, 800, 800)
}

function preload() {
  avatar = loadImage(User.avatar);
}

function setup() {
	createCanvas(800, 800);
	gameInit()
}

function draw() {
	background(160)
	// handle bullets
	for (let i = 0; i < bullets.length; i++) {
		let bullet = bullets[i]
		bullet.fly()
		bullet.display()
	}
	// handle players
	for (let i = 0; i < players.length; i++) {
		let player = players[i]
		if (keyIsPressed) {
			player.movement()
		}
		player.display()
	}
	// validate game
	gameMap.validatePlayersBoundries(players)
}

class Player {
	constructor(x, y, user) {
		this.x = x
		this.y = y
		this.facing = 2 // top = 0, right = 1, bottom = 2, left = 3
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
			this.facing = FACE_UP
			// down
		} else if(keyIsDown(83)) {
			this.y += this.walk_speed
			this.facing = FACE_DOWN
		}
		// left
		if (keyIsDown(65)) {
			this.x -= this.walk_speed
			this.facing = FACE_LEFT
		} else if (keyIsDown(68)) {
			// right
			this.x += this.walk_speed
			this.facing = FACE_RIGHT
		}
		// sprint
		if (keyIsDown(16)) {
			this.walk_speed = this.sprint_speed
		} else {
			this.walk_speed = this.speed
		}
		// Power
		if (keyIsDown(32)) {
			let gun = this.weapons[this.weapon];
			gun.shoot()
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
		this.fireRate = 400 // can shoot every 400ms
	}

	shoot() {
		if (this.canShoot) {
			let bullet = new Bullet(this.user)
			bullets.push(bullet)
			this.canShoot = false
			setTimeout(() => {
				this.canShoot = true
			}, this.fireRate)
		}
	}
}

class Bullet {
	constructor(user) {
		this.x = user.x + user.width / 2
		this.y = user.y + user.width / 2
		this.width = Config.Bullet.width
		this.height = Config.Bullet.height
		this.direction = user.facing
		this.speed = Config.Bullet.speed
		this.user = user
		this.color = Config.Bullet.color
	}

	fly() {
		if (this.direction === FACE_UP) {
			this.y -= this.speed
		} else if (this.direction === FACE_DOWN) {
			this.y += this.speed
		} else if (this.direction === FACE_RIGHT) {
			this.x += this.speed
		} else if (this.direction === FACE_LEFT) {
			this.x -= this.speed
		}
	}

	remove() {

	}

	display() {
		fill(this.color)
		rectMode(CENTER)
		if (this.direction === FACE_UP || this.direction === FACE_DOWN) {
			print('up')
			rect(this.x, this.y, this.width, this.height)
		} else {
			rect(this.x, this.y, this.height, this.width)
		}
	}
}

class GameMap {
	constructor(x, y, width, height) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	validatePlayersBoundries(players) {
		for (let i = 0; i < players.length; i++) {
			let player = players[i]
			// check horizontally
			// top
			if (player.x < 0) {
				player.x = this.width - player.width
				// bottom
			} else if (player.x + player.width > this.width) {
				player.x = 0
			// check vertically
				// left
			} else if (player.y < 0) {
				player.y = this.height - player.width
				// right
			} else if (player.y + player.width > this.height) {
				player.y = 1
			}
		}
	}

	validateBulletBoundries(bullets) {

	}
}