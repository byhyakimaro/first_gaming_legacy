import * as express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import * as fs from 'fs'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const sockets = []

function getSprites(playerSkin) {
  const spriteArray = []
  const actionPlayer = fs.readdirSync(`public/images/SpritesPlayer/Reaper_Man_${playerSkin}/`)
  actionPlayer.forEach(file => {
    const basePath =`public/images/SpritesPlayer/Reaper_Man_${playerSkin}/${file}/`
    const sprites = fs.readdirSync(basePath)
    for (let i = 0; i < sprites.length; i++) {
      spriteArray.unshift((`${basePath}0_Reaper_Man_Walking_${i}.png`).replace(/public\//g,''))
    }
  })
  return spriteArray
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  sockets.unshift(socket)
  socket.on('getSprites',(params)=>{
    socket.emit('callbackSprites',getSprites(params.skin))
  })
  // socket.on('attack',()=>{
  //   game.actionPlayer = 'Slashing'
  //   setTimeout(()=>game.actionPlayer = 'Walking',500) 
  // })
  // socket.on('setSlide',()=>{
  //   game.actionPlayer = 'Sliding'
  //   setTimeout(()=>game.actionPlayer = 'Walking',500)
  // })
  // socket.on('setFly',()=>{
  //   if(game.fly) {
  //     game.fly = false
  //     game.actionPlayer = 'Walking'
  //   } else {
  //     game.fly = true
  //     game.actionPlayer = 'Jump Loop'
  //   }
  // })
  // socket.on('moveUp',()=>{
  //   game.playerY = game.playerY - game.pixelSteps
  // })
  // socket.on('moveDown',()=>{
  //   game.playerY = game.playerY + game.pixelSteps
  // })
  // socket.on('moveLeft',()=>{
  //   game.playerX = game.playerX - game.pixelSteps
  //   game.reverseSkins = true
  // })
  // socket.on('moveRight',()=>{
  //   game.playerX = game.playerX + game.pixelSteps
  //   game.reverseSkins = false
  // })
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
