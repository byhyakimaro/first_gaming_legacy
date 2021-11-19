import * as express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import * as fs from 'fs'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const sockets = []

function getSprites(playerSkin) {
  const array = []
  const actionPlayer = fs.readdirSync(`public/images/SpritesPlayer/Reaper_Man_${playerSkin}/`)
  actionPlayer.forEach(file => {
    const basePath =`public/images/SpritesPlayer/Reaper_Man_${playerSkin}/${file}/`
    const sprites = fs.readdirSync(basePath)
      array.unshift({action:file, sprites: sprites.length})
  })
  return array
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  sockets.unshift(socket)
  socket.on('getSprites',async (params)=>{
    socket.emit('callbackSprites',await getSprites(params.skin))
  })
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
