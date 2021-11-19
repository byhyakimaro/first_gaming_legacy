
import animatePlayer from './Player.js'

const socket = window.io()

export default class Game {
  canvas = document.querySelector('canvas')
  ctx = this.canvas.getContext('2d')

  constructor() {
    this.setSprites()
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  setSprites() {
    socket.emit('getSprites')
    socket.on('callbackSprites',(sprites)=>{
      new animatePlayer(this.canvas, this.ctx, sprites)
    })
  }
}

socket.on('connect', () => {
  console.log('> Connected to server')
  new Game()
})
