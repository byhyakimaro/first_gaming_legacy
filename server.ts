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
  playerY = height/2
  playerX = width/2
  fly = false

  constructor () {
    this.Scene()
    this.player(width/2, height/2)
  }

  Scene () {
    ctx.fillStyle = '#764abc'
    ctx.fillRect(0, 0, width, height)
  }

  Update () {
    ctx.clearRect(0, 0, width, height)
    this.Scene()
  }

  gravity (gravity: number) {
    if(!this.fly) {
      this.playerY = this.playerY + gravity
      this.hitBase()
      this.player(this.playerX,this.playerY)
    }
  }

  hitBase () {
    const floor = gaming.height - this.playerHeight
    if (this.playerY >= floor) {
      this.playerY = floor
    }
  }

  async player(x: number, y: number) {
    const player = await loadImage('public/images/player.png')
    this.Update()
    ctx.drawImage(player,x, y, this.playerHeight, this.playerHeight)
    console.log(x,y)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
  socket.on('setFly',()=>{
    console.log(game.fly)
    if(game.fly) {
      game.fly = false
    } else {
      game.fly = true
    }
  })
  socket.on('moveUp',()=>{
    game.playerY = game.playerY - game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveLeft',()=>{
    game.playerX = game.playerX - game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveDown',()=>{
    game.playerY = game.playerY + game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  socket.on('moveRight',()=>{
    game.playerX = game.playerX + game.pixelSteps
    game.player(game.playerX, game.playerY)
  })
  function updateGame() {
    setTimeout(()=>{
      socket.emit('scene', gaming.toDataURL())
      game.gravity(10)
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
