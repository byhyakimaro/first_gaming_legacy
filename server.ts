import * as express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { Game } from './Game'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

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
