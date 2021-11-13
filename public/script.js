const socket = io("/")

socket.on('connect', () => {
  connected = true
  console.log('> Connected to server')
})


