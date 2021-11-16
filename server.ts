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
    ctx.fillRect(width/1.8, height-100, 10, 100)
  }

  UpdateScene () {
    ctx.clearRect(0, 0, width, height)
    this.Scene()
    this.collision(width/1.8, height-100)
  }

  gravity (gravity: number) {
    if(!this.fly) {
      this.playerY = this.playerY + gravity
    }
    
    const floor = gaming.height - this.playerHeight
    if (this.playerY > floor) {
      this.playerY = floor
    }
    this.player(this.playerX,this.playerY)
  }

  collision (ObjX:number, ObjY:number) {
    const playerRight = this.playerX+this.playerHeight
    const playerLeft = this.playerX
    const heightObj = ObjY-this.playerHeight
    const objLeft =ObjX
    const objRight = ObjX+10
    if((playerRight >= objLeft) && (playerLeft <= objRight) && (this.playerY >= heightObj)) {
      this.isColliding = true
    } else {
      this.isColliding = false
    }
  }

  async player(x: number, y: number) {
    const player = await loadImage(this.playerFrame)
    this.UpdateScene()
    ctx.drawImage(player,x, y, this.playerHeight, this.playerHeight)
    console.log(`x: ${x} y: ${y}, isColliding: ${this.isColliding}`)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
  socket.on('setFly',()=>{
    console.log(game.fly)
    if(game.fly) {
      game.fly = false
      game.playerFrame = 'public/images/player_right.png'
    } else {
      game.fly = true
      game.playerFrame = 'public/images/player_right_fly.png'
    }
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveUp',()=>{
    game.playerY = game.playerY - game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveDown',()=>{
    game.playerY = game.playerY + game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveLeft',()=>{
    game.fly ? game.playerFrame = 'public/images/player_left_fly.png' : game.playerFrame = 'public/images/player_left.png'
    if(game.isColliding) {
      game.playerX = game.playerX + game.pixelSteps
    } else {
      game.playerX = game.playerX - game.pixelSteps
    }
  })
  socket.on('moveRight',()=>{
    game.fly ? game.playerFrame = 'public/images/player_right_fly.png' : game.playerFrame = 'public/images/player_right.png'
    if(game.isColliding) {
      game.playerX = game.playerX - game.pixelSteps
    } else {
      game.playerX = game.playerX + game.pixelSteps
    }
    game.player(game.playerX, game.playerY)
  })
  function updateGame() {
    setTimeout(()=>{
      socket.emit('scene', gaming.toDataURL())
      game.UpdateGame()
      updateGame()
    },1)
  }
  updateGame()
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
