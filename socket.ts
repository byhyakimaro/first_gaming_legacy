import httpServer  from './server'
import { Server } from 'socket.io'
import { getSprites, setRegister, uuid } from './modules'

const io = new Server(httpServer)

const connected = {}

io.on('connection',(socket)=>{
  console.log(`${socket.id} connected`)
  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`)
  })

  socket.on('register', (nick)=>{
    const data = setRegister(nick)
    connected[data.token] = { nick: data.nick, hex: data.hex, token: data.token, socket }
    socket.emit('newRegister', Buffer.from(JSON.stringify(data)).toString('base64'))
  })

  socket.on('login', (token)=>{
    try { 
      const tokenID = JSON.parse(Buffer.from(token, 'base64').toString())
      if(connected[tokenID.token]) {
        socket.emit('loginSuccess')
      } else {
        socket.emit('failedLogin')
      }
    } catch (e) {
      socket.emit('failedLogin')
    }
  })

  socket.on('getSprites',async (params)=>{
    socket.emit('callbackSprites',await getSprites())
  })
})