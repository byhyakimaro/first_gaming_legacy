


function $(element) {
  return document.querySelector(element)
}

const pressed = {}

document.onkeydown = ({ key }) => pressed[key] = true
document.onkeyup = ({ key }) => delete pressed[key]

export default class animatePlayer {
  timeCurrent = Date.now()

  velocity = { x: 0, y: 0 }
  coordinates = { x: 0, y: 0, w: 128, h: 128 }

  playerSkin = 2
  playerReverse = false
  playerSpritesIndex = 0
  playerAction = 'Idle'
  gravity = 1.4
  jumpForce = 25
  friction = 0.85
  speed = 1

  constructor(canvas, ctx, playerSprites) {
    this.playerSprites = playerSprites
    this.canvas = canvas
    this.ctx = ctx
    this.animatePlayer()
  }

  setAction(actionSet) {
    if(!this.playerSprites.find(({ action }) => action === actionSet)) {
      console.log(this.playerSprites)
      throw new Error('Invalid action')
    }
    this.playerAction = actionSet
  }

  checkCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if(x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2){
      return true
    }
  }

  checkDistance(colision, coordinate) {
    const playerDimention = { x: 'w', y: 'h' }[coordinate]
    const blockDimention = { x: 0, y: 1 }[coordinate]
  
    const pC = this.coordinates[coordinate]
    const pS = this.coordinates[playerDimention]
  
    const bC = colision[blockDimention]
    const bS = 10
  
    const distance = bC > pC ? (pC + pS) - bC : pC - (bC + bS);
  
    return - distance;
  }

  calculateCollision() {
    const checkCol = this.checkCollision(
      this.coordinates['x'],
      this.coordinates['y'],
      this.coordinates['w'],
      this.coordinates['h'],
      470,549,120,10
    )

    if(checkCol) {
      this.coordinates['y'] += this.checkDistance([470,549],'y')

      this.velocity['y'] = 0
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

  drawText(Text, textX, textY) {
    this.ctx.save()
    this.ctx.fillStyle = '#000000'
    this.ctx.font = "20px Courier"
    this.ctx.fillText(Text, textX, textY)
    this.ctx.restore()
  }

  animatePlayer() {
    let nowTime = Date.now()
    var fps = Math.round(1000 / (nowTime - this.timeCurrent))
    this.timeCurrent = nowTime
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawText(`x: ${Math.round(this.coordinates['x'])} y: ${Math.round(this.coordinates['y'])} fps: ${fps}`, 10, 30)

    if(!Object.keys(pressed).length) this.setAction('Idle')

    const floor = this.canvas.height - this.coordinates['h']
    if (this.coordinates['y'] > floor) {
      this.coordinates['y'] = floor
      this.velocity['y'] = 0
      
      if(pressed.w) {
        this.velocity['y'] =- this.jumpForce
        this.setAction('Jump Loop')
        setTimeout(()=>this.setAction('Walking'), 500)
      }
    }
    
    if(pressed.a) {
      this.velocity['x'] -= this.speed
      this.playerReverse = true
      this.setAction('Walking')
    }
    if(pressed.d) {
      this.velocity['x'] += this.speed
      this.playerReverse = false
      this.setAction('Walking')
    }
    if(pressed.s) this.velocity['y'] += this.speed

    this.calculateCollision()

    this.velocity['x'] *= this.friction
    this.velocity['y'] += this.gravity
  
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
