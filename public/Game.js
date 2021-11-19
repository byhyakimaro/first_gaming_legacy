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

class Game {
  velX = 0
  velY = 0
  playerX = 0
  playerY = 0
  playerSkin = 1
  playerSprites = []
  playerSpritesIndex = 0
  playerAction = 'Walking'
  playerWidth = 128
  playerHeight = 128
  playerCollision = false
  gravity = 1.4
  jumpForce = 25
  friction = 0.85
  speed = 1
  framesDelay = 60
  oldTime = Date.now()
  fps = 0

  constructor() {
    this.setSprites()
    setTimeout(()=> this.animatePlayer(),100)
  }

  setSprites() {
    socket.emit('getSprites',{skin:this.playerSkin})
    socket.on('callbackSprites',(sprites)=>{
      this.playerSprites = sprites
    })
  }

  flipPlayer(img, x, y, w, h) {
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(img, -x-100, y, w, h)
    ctx.restore()
  }

  drawText(Text, textX, textY) {
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.font = "20px Courier"
    ctx.fillText(Text, textX, textY)
    ctx.restore()
  }

  drawObj(ObjX, ObjY, ObjWidth, ObjHeight) {
    ctx.save()
    ctx.fillStyle = '#000000'
    ctx.fillRect(ObjX, ObjY, ObjWidth, ObjHeight)
    ctx.restore()
  }

  animatePlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let nowTime = Date.now()
    this.fps = Math.round(1000 / (nowTime - this.oldTime))
    this.oldTime = nowTime
    this.drawText(`x: ${Math.round(this.playerX)} y: ${Math.round(this.playerY)} fps: ${this.fps}`, canvas.width-300, 30)
  
    if(pressed.a) this.velX -= this.speed
    if(pressed.d) this.velX += this.speed
    
    if(pressed.s) this.velY += this.speed
  
    this.velX *= this.friction
    // this.velY *= this.friction
    
    this.velY += this.gravity
  
    this.playerX += this.velX
    this.playerY += this.velY

    const floor = canvas.height - this.playerHeight
    if (this.playerY > floor) {
      this.playerY = floor
      this.velY = 0

      if(pressed.w) {
        this.velY =- this.jumpForce
        this.playerAction = 'Jump Loop'
        setTimeout(()=>this.playerAction = 'Walking',500) 
      } 
    }
  
    const playerImg = new Image()
    this.playerSpritesIndex ++
    const spritesLength = this.playerSprites.find(({ action }) => action === this.playerAction)
    if(this.playerSpritesIndex >= spritesLength.sprites) this.playerSpritesIndex = 0
    playerImg.src = `images/SpritesPlayer/Reaper_Man_${this.playerSkin}/${this.playerAction}/0_Reaper_Man_Walking_${this.playerSpritesIndex}.png`
    if(!pressed.a) ctx.drawImage(playerImg, this.playerX, this.playerY, this.playerWidth, this.playerHeight)
    if(pressed.a) this.flipPlayer(playerImg, this.playerX, this.playerY, this.playerWidth, this.playerHeight)
    
    this.drawObj(canvas.width/1.8, canvas.height-200, 100, 10)
    setTimeout(()=>this.animatePlayer(),1000/this.framesDelay)
  }
}

socket.on('connect', () => {
  console.log('> Connected to server')
  new Game()
})
