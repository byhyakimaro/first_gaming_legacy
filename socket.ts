import httpServer  from './server'
import { Server } from 'socket.io'
import { getSprites, setRegister, uuid } from './modules'

const io = new Server(httpServer)

const sockets = []
const connected = {}

io.on('connection',(socket)=>{
  sockets.unshift(socket)
  sockets.forEach(socket => {
    console.log(sockets.length)
  })

  socket.on("disconnect", () => {
    sockets.splice(sockets.indexOf(socket))
  })

  socket.on('register', (nick)=>{
    const data = setRegister(socket.id, nick)
    connected[data.token] = data
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