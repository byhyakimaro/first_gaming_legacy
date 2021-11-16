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
  
  pixelSteps = 2
  playerY = height/2
  playerX = width/2

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
    this.playerY = this.playerY + gravity
    this.hitBase()
    this.player(this.playerX,this.playerY)
  }

  hitBase () {
    const base = gaming.height - 100
    if (this.playerY >= base) {
      this.playerY = base
    }
  }

  async player(x: number, y: number) {
    const player = await loadImage('public/images/player.png')
    this.Update()
    ctx.drawImage(player,x, y, 64, 64)
    console.log(x,y)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
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
      game.gravity(1)
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
