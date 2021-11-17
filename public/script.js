const socket = io("/")

function $(element) {
  return document.querySelector(element)
}

socket.on('connect', () => {
  console.log('> Connected to server')
})

socket.emit('screenSize',{ width: window.innerWidth, height: window.innerHeight })

socket.on('scene', (game) => {
  $('#gaming').src = game
})

document.addEventListener('keydown',({key}) => {
  if(key === 'w') {
    socket.emit('moveUp')
  } else if(key === 's') {
    socket.emit('moveDown')
  }else if(key === 'a') {
    socket.emit('moveLeft')
  }else if(key === 'd') {
    socket.emit('moveRight')
  }else if(key === ' ') {
    socket.emit('setFly')
  }
  console.log(key)
})

document.addEventListener('click',(event) => {
  socket.emit('attack')
  console.log(event.ctrlKey)
})
