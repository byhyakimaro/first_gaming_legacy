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

socket.emit('getSprites',{action:'Walking', skin:'1'})
socket.on('callbackSprites',(sprites)=>{
  console.log(sprites)
})

class Game {
  velX = 0
  velY = 0
  playerX = 0
  playerY = 0
  playerSkin = 2
  playerAction = 'Walking'
  playerWidth = 128
  playerHeight = 128
  gravity = 1.4
  jumpForce = 25
  friction = 0.85
  speed = 1
  framesDelay = 75
  oldTime = Date.now()
  fps = 0

  constructor() {
    this.animatePlayer()
  }

  animatePlayer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    let nowTime = Date.now()
    this.fps = Math.round(1000 / (nowTime - this.oldTime))
    this.oldTime = nowTime
    ctx.fillStyle = '#000000'
    ctx.font = "20px Courier"
    ctx.fillText(`x: ${Math.round(this.playerX)} y: ${Math.round(this.playerY)} fps: ${this.fps}`, canvas.width-300, 30)
  
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

      if(pressed.w) this.velY =- this.jumpForce
    }
  
    const playerImg = new Image()
    playerImg.src = `images/SpritesPlayer/Reaper_Man_${this.playerSkin}/${this.playerAction}/0_Reaper_Man_Walking_0.png`
    ctx.drawImage(playerImg, this.playerX, this.playerY, this.playerWidth, this.playerHeight)

    setTimeout(()=>this.animatePlayer(),1000/this.framesDelay)
  }
}
new Game