import * as express from 'express'
import { createServer } from 'http'
import { Server, Socket } from 'socket.io'
import * as fs from 'fs'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)

const sockets = []

function getSprites() {
  const array = []
  const actionPlayer = fs.readdirSync(`public/images/SpritesPlayer/Reaper_Man_1/`)
  actionPlayer.forEach(file => {
    const basePath =`public/images/SpritesPlayer/Reaper_Man_1/${file}/`
    const sprites = fs.readdirSync(basePath)
      array.unshift({action:file, sprites: sprites.length})
  })
  return array
}

function uuid() {
  return (
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16))
}

function setRegister(socket, nick?) {
  if(!nick) nick = 'Guest'
  const token = uuid()
  const nickColor = `#${Math.floor(Math.random()*16777215).toString(16)}`.toUpperCase()
  const user = { nick: nick+nickColor, token }

  return sockets[socket] = user
}

io.on('connection',(socket)=>{
  console.log(socket.id)
  sockets.unshift(socket)

  socket.on('register', (nick)=>{
    console.log(setRegister(socket, nick))
  })

  socket.on('getSprites',async (params)=>{
    socket.emit('callbackSprites',await getSprites())
  })
})

app.use(express.static(__dirname + '/public'))
app.get('/',(req, res) => { 
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000,()=>console.log('game started'))
