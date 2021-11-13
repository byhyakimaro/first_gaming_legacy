import * as express from 'express'
import { createCanvas, loadImage } from 'canvas'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const width = 900
const height = 600

const gaming = createCanvas(width, height)
const ctx = gaming.getContext('2d')

class Game {
  construct() {
    this.scene()
    return gaming.toBuffer()
  }

  async scene() {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    
    const playerSprite = await loadImage('images/player_sprite.gif')
    ctx.drawImage(playerSprite, 0, 0, width, height)
  }
}
const game = new Game()

io.on('connection',(socket)=>{
  console.log(socket.id)

  socket.emit('scene', game)
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
