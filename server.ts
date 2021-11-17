import * as express from 'express'
import { createCanvas, loadImage } from 'canvas'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const width = 1200
const height = 700

const gaming = createCanvas(width, height)
const ctx = gaming.getContext('2d')

class Game {
  
  pixelSteps = 4
  fps = 0
  playerHeight = 48
  playerFrame = 'public/images/player_right.png'
  isColliding = false
  playerY = height/2
  playerX = width/2
  fly = false

  constructor () {
    this.Scene()
    this.player(this.playerX, this.playerY)
  }

  UpdateGame() {
    this.gravity(10)
  }

  Scene () {
    ctx.fillStyle = '#764abc'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#000000'
    ctx.fillRect(width/1.8, height-200, 100, 10)
  }

  UpdateScene () {
    ctx.clearRect(0, 0, width, height)
    this.Scene()
    this.collision(width/1.8, height-200, 100, 10)
  }

  gravity (gravity: number) {
    if(!this.fly && !this.isColliding) {
      this.playerY = this.playerY + gravity
    }
    
    const floor = gaming.height - this.playerHeight
    if (this.playerY > floor) {
      this.playerY = floor
    }
    this.player(this.playerX,this.playerY)
  }

  collision (ObjX:number, ObjY:number, ObjWidth:number, ObjHeight:number) {
    const playerLeft = this.playerX
    const playerRight = this.playerX + this.playerHeight
    const playerTop = this.playerY
    const playerBottom = this.playerY + this.playerHeight
    const objLeft = ObjX
    const objRight = ObjX + ObjWidth
    const objTop = ObjY
    const objDown = ObjY + ObjHeight
    if((playerBottom < objTop) || (playerTop > objDown) || (playerRight < objLeft) || (playerLeft > objRight)) {
      this.isColliding = false
    } else {
      this.isColliding = true
    }
  }

  async player(x: number, y: number) {
    const player = await loadImage(this.playerFrame)
    this.UpdateScene()
    ctx.drawImage(player,x, y, this.playerHeight, this.playerHeight)
    console.log(`x: ${x} y: ${y}, isColliding: ${this.isColliding}, fps: ${this.fps}`)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
  socket.on('setFly',()=>{
    if(game.fly) {
      game.fly = false
      game.playerFrame = 'public/images/player_right.png'
    } else {
      game.fly = true
      game.playerFrame = 'public/images/player_right_fly.png'
    }
  })
  socket.on('moveUp',()=>{
    game.playerY = game.playerY - game.pixelSteps
  })
  socket.on('moveDown',()=>{
    game.playerY = game.playerY + game.pixelSteps
  })
  socket.on('moveLeft',()=>{
    game.fly ? game.playerFrame = 'public/images/player_left_fly.png' : game.playerFrame = 'public/images/player_left.png'
    game.playerX = game.playerX - game.pixelSteps
  })
  socket.on('moveRight',()=>{
    game.fly ? game.playerFrame = 'public/images/player_right_fly.png' : game.playerFrame = 'public/images/player_right.png'
    game.playerX = game.playerX + game.pixelSteps
  })
  let oldTime = Date.now()
  function updateGame() {
    let nowTime = Date.now()
    game.fps = Math.round(1000 / (nowTime - oldTime))
    oldTime = nowTime
    setImmediate(()=>{
      socket.emit('scene', gaming.toDataURL())
      game.UpdateGame()
      updateGame()
    })
  }
  updateGame()
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
