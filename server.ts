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
  constructor () {
    this.Scene()
  }

  async Scene () {
    ctx.fillStyle = '#993399'
    ctx.fillRect(0, 0, width, height)

    const player = await loadImage('public/images/player.png')
    ctx.drawImage(player, width/2, height/2, player.width, player.height)
  }
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  new Game()
  socket.emit('scene', gaming.toDataURL())
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
