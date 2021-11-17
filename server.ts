import * as express from 'express'
import { createCanvas, loadImage } from 'canvas'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const width = 1200
const height = 749

const gaming = createCanvas(width, height)
const ctx = gaming.getContext('2d')

class Game {
  
  pixelSteps: number = 4
  fps: number = 0
  oldTime: number = Date.now()
  playerWidth: number
  playerHeight: number 
  playerFrame: string = 'public/images/player_sprites/PNG/Wraith_01/PNG Sequences/Walking/Wraith_01_Moving Forward_000.png'
  sockets = []
  isColliding: boolean = false
  playerY: number = height/2
  playerX: number = width/2
  fly: boolean = false

  constructor () {
    this.Scene()
    this.player(this.playerX, this.playerY)
    this.UpdateGame()
  }

  UpdateGame() {
    let nowTime = Date.now()
    this.fps = Math.round(1000 / (nowTime - this.oldTime))
    this.oldTime = nowTime
    this.sockets.forEach(socket => {
      socket.emit('scene', gaming.toDataURL())
    })
    this.gravity(10)
    console.log(`x: ${this.playerX}, y: ${this.playerY}, isColliding: ${this.isColliding}, isFlying: ${this.fly} , fps: ${this.fps}`)
    setImmediate(()=>this.UpdateGame())
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
    this.playerWidth = player.width/4
    this.playerHeight = player.height/4
    this.UpdateScene()
    ctx.drawImage(player,x, y, this.playerWidth, this.playerHeight)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
  game.sockets.unshift(socket)
  socket.on('setFly',()=>{
    if(game.fly) {
      game.fly = false
    } else {
      game.fly = true
    }
  })
  socket.on('moveUp',()=>{
    game.playerY = game.playerY - game.pixelSteps
  })
  socket.on('moveDown',()=>{
    game.playerY = game.playerY + game.pixelSteps
  })
  socket.on('moveLeft',()=>{
    game.playerX = game.playerX - game.pixelSteps
  })
  socket.on('moveRight',()=>{
    game.playerX = game.playerX + game.pixelSteps
  })
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
