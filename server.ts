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

  async player(x: number, y: number) {
    const player = await loadImage('public/images/player.png')
    this.Update()
    ctx.drawImage(player,x, y, 64, 64)
  }
}

const pixelSteps = 2
let playerY = height/2
let playerX = width/2

io.on('connection',(socket)=>{
  console.log(socket.id)
  const game = new Game()
  socket.on('moveUp',()=>{
    playerY = playerY - pixelSteps
    game.player(playerX, playerY)
  })
  socket.on('moveLeft',()=>{
    playerX = playerX - pixelSteps
    game.player(playerX, playerY)
  })
  socket.on('moveDown',()=>{
    playerY = playerY + pixelSteps
    game.player(playerX, playerY)
  })
  socket.on('moveRight',()=>{
    playerX = playerX + pixelSteps
    game.player(playerX, playerY)
  })
  function updateGame() {
    setTimeout(()=>{
      socket.emit('scene', gaming.toDataURL())
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
