const socket = io("/")

function $(element) {
  return document.querySelector(element)
}

socket.on('connect', () => {
  console.log('> Connected to server')
})

socket.on('scene', (game) => {
  $('#gaming').src = game
})

