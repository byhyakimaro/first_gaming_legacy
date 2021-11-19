const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

function $(element) {
  return document.querySelector(element)
}

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const pressed = {}

document.onkeydown = ({ key }) => pressed[key] = true
document.onkeyup = ({ key }) => delete pressed[key]

const socket = window.io()

socket.on('connect', () => {
  console.log('> Connected to server')
})

class Game {
  velX = 0
  velY = 0
  playerX = 0
  playerY = 0
  playerSkin = 2
  playerSprites = []
  playerReverse = false
  playerSpritesIndex = 0
  playerAction = 'Idle'
  playerWidth = 128
  playerHeight = 128
  gravity = 1.4
  jumpForce = 25
  friction = 0.85
  speed = 1
  framesDelay = 60
  oldTime = Date.now()
  fps = 0

  constructor() {
    this.setSprites()
  }

  setSprites() {
    socket.emit('getSprites',{skin:this.playerSkin})
    socket.on('callbackSprites',(sprites)=>{
      this.playerSprites = sprites
      this.animatePlayer()
    })
  }

  setAction(actionSet) {
    if(!this.playerSprites.find(({ action }) => action === actionSet)) {
      console.log(this.playerSprites)
      throw new Error('Invalid action')
    }
    this.playerAction = actionSet
  }

  drawText(Text, textX, textY) {
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.font = "20px Courier"
    ctx.fillText(Text, textX, textY)
    ctx.restore()
  }

  drawPlayer(playerImg, playerX, playerY, playerWidth, playerHeight) {
    ctx.save()
    if(this.playerReverse) {
      ctx.scale(-1, 1)
      ctx.drawImage(playerImg, -playerX-100, playerY, playerWidth, playerHeight)
    } else {
      ctx.drawImage(playerImg, playerX, playerY, playerWidth, playerHeight)
    }
    ctx.restore()
  }

  drawObj(Color, ObjX, ObjY, ObjWidth, ObjHeight) {
    ctx.save()
    ctx.fillStyle = Color
    ctx.fillRect(ObjX, ObjY, ObjWidth, ObjHeight)
    ctx.restore()

    if(this.playerX + this.playerWidth > ObjX && 
      this.playerX < ObjX + ObjWidth && 
      this.playerY + this.playerHeight > ObjY && 
      this.playerY < ObjY + ObjHeight){
      this.velY = 0
    } 
  }

  animatePlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let nowTime = Date.now()
    this.fps = Math.round(1000 / (nowTime - this.oldTime))
    this.oldTime = nowTime
    this.drawText(`velX:${Math.round(this.velX)} velY:${Math.round(this.velY)} x: ${Math.round(this.playerX)} y: ${Math.round(this.playerY)} fps: ${this.fps}`, 10, 30)
    
    if(!Object.keys(pressed).length) this.setAction('Idle')

    const floor = canvas.height - this.playerHeight
    if (this.playerY > floor) {
      this.playerY = floor
      this.velY = 0
      
      if(pressed.w) {
        this.velY =- this.jumpForce
        this.setAction('Jump Loop')
        setTimeout(()=>this.setAction('Walking'), 500)
      }
    }
    
    if(pressed.a) {
      this.velX -= this.speed
      this.playerReverse = true
      this.setAction('Walking')
    }
    if(pressed.d) {
      this.velX += this.speed
      this.playerReverse = false
      this.setAction('Walking')
    }
    if(pressed.s) this.velY += this.speed
    
    this.drawObj('#000000',canvas.width/1.8, canvas.height-200, 100, 10)
    
    this.velX *= this.friction
    this.velY += this.gravity
  
    this.playerX += this.velX
    this.playerY += this.velY
    
    this.playerSpritesIndex ++
    const spritesLength = this.playerSprites.find(({ action }) => action === this.playerAction)
    if(this.playerSpritesIndex >= spritesLength.sprites) this.playerSpritesIndex = 0
  
    const playerImg = new Image()
    playerImg.src = `images/SpritesPlayer/Reaper_Man_${this.playerSkin}/${this.playerAction}/0_Reaper_Man_Walking_${this.playerSpritesIndex}.png`
    this.drawPlayer(playerImg, this.playerX, this.playerY, this.playerWidth, this.playerHeight)
    
    ctx.strokeStyle = 'red'
    ctx.strokeRect(this.playerX, this.playerY, this.playerWidth, this.playerHeight)

    setTimeout(()=>this.animatePlayer(),1000/this.framesDelay)
  }
}
const game = new Game()
