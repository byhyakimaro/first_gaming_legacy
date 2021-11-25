const pressed = {}

document.onmousedown = ({ path }) => pressed[path[0].id] = true
document.onmouseup = ({ path }) => delete pressed[path[0].id]
document.onkeydown = ({ key }) => pressed[key] = true
document.onkeyup = ({ key }) => delete pressed[key]

export default class Player {
  velocity = { x: 0, y: 0 }
  coordinates = { x: 0, y: 0, w: 128, h: 128 }
  
  playerReverse = false
  collision = false
  playerSpritesIndex = 0
  playerAction = 'Idle'
  gravity = 1.4
  jumpForce = 25
  friction = 0.85
  speed = 1

  constructor(canvas, ctx, playerSprites, data) {
    this.playerSkin = data.skin
    this.playerData = JSON.parse(atob(localStorage.getItem('token')))
    this.playerSprites = playerSprites
    this.canvas = canvas
    this.ctx = ctx
    this.animatePlayer()
  }

  setAction(actionSet) {
    if(!this.playerSprites.find(({ action }) => action === actionSet)) {
      throw new Error('Invalid action')
    }
    this.playerAction = actionSet
  }

  calculateDistance(block, coordinate) {
    const bC = { x: 0, y: 1 }[coordinate]
    const bS = { x: 2, y: 3 }[coordinate]
    const pS = { x: 'w', y: 'h' }[coordinate]

    const blockCoordinate = block[bC]
    const blockSize = block[bS]

    const playerCoordinate = this.coordinates[coordinate]
    const playerSize = this.coordinates[pS]

    const distance = blockCoordinate > playerCoordinate ? (playerCoordinate + playerSize) - blockCoordinate : playerCoordinate - (blockCoordinate + blockSize)

    return - distance
  }

  willCollide(coordinate, velocity) {
    const blockCoordinate = { x: 0, y: 1, w: 2, h: 3 }

    const nextPosition = {
      x: this.coordinates['x'],
      y: this.coordinates['y'],
      w: this.coordinates['w'],
      h: this.coordinates['h']
    }
    nextPosition[coordinate] += velocity

    for(let block of document.game.blocks) {
      if (
        nextPosition.x + nextPosition.w > block[blockCoordinate['x']] &&
        nextPosition.x < block[blockCoordinate['x']] + block[blockCoordinate['w']] &&
        nextPosition.y + nextPosition.h > block[blockCoordinate['y']] &&
        nextPosition.y < block[blockCoordinate['y']] + block[blockCoordinate['h']]
      ) return block
    }
  }

  calculateCollision() {
    for(const coordinate of ['x', 'y']) {
      const velocity = coordinate === 'y' ? this.velocity['y'] += this.gravity : this.velocity['x']
      const coll = this.willCollide(coordinate, velocity)
      if(coll) {
        this.velocity[coordinate] = this.calculateDistance(coll, coordinate)
        this.collision = true
      } else {
        this.collision = false
        velocity
      }
    }
  }

  drawPlayer(playerImg, playerX, playerY, playerWidth, playerHeight) {
    this.ctx.save()
    if(this.playerReverse) {
      this.ctx.scale(-1, 1)
      this.ctx.drawImage(playerImg, -playerX-100, playerY, playerWidth, playerHeight)
    } else {
      this.ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight)
    }
    this.ctx.restore()
  }

  animatePlayer() {
    if(!Object.keys(pressed).length) this.setAction('Idle')

    const floor = this.canvas.height - this.coordinates['h']
    if (this.coordinates['y'] > floor) {
      this.coordinates['y'] = floor
      this.velocity['y'] = 0
      if(this.coordinates['y'] == floor) {
        this.collision = true
      } else {
        this.collision = false
      }
    }

    if(pressed.w && this.collision || pressed.top && this.collision) {
      this.velocity['y'] =- this.jumpForce
      this.setAction('Jump Loop')
      setTimeout(()=>this.setAction('Walking'), 500)
    }
    
    if(pressed.a || pressed.left) {
      this.velocity['x'] -= this.speed
      this.playerReverse = true
      this.setAction('Walking')
    }
    if(pressed.d || pressed.right) {
      this.velocity['x'] += this.speed
      this.playerReverse = false
      this.setAction('Walking')
    }
    if(pressed.s || pressed.down) this.velocity['y'] += this.speed

    this.calculateCollision()

    this.velocity['x'] *= this.friction
    // this.velocity['y'] += this.gravity
  
    this.coordinates['x'] += this.velocity['x']
    this.coordinates['y'] += this.velocity['y']
    
    this.playerSpritesIndex ++
    const spritesLength = this.playerSprites.find(({ action }) => action === this.playerAction)
    if(this.playerSpritesIndex >= spritesLength.sprites) this.playerSpritesIndex = 0

    const playerImg = new Image()
    playerImg.src = `images/SpritesPlayer/Reaper_Man_${this.playerSkin}/${this.playerAction}/0_Reaper_Man_Walking_${this.playerSpritesIndex}.png`
    this.drawPlayer(playerImg, this.coordinates['x'], this.coordinates['y'], this.coordinates['w'], this.coordinates['h'])

    this.ctx.strokeStyle = 'red'
    this.ctx.strokeRect(this.coordinates['x'], this.coordinates['y'], this.coordinates['w'], this.coordinates['h'])
  }
}
