
import animatePlayer from './Player.js'
import animateMap from './Map.js'

const socket = window.io()

export default class Game {
  canvas = document.querySelector('canvas')
  ctx = this.canvas.getContext('2d')
  framesDelay = 60
  player

  constructor() {
    this.setSprites()
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  setSprites() {
    socket.emit('getSprites')
    socket.on('callbackSprites',(sprites)=>{
      this.player = new animatePlayer(this.canvas, this.ctx, sprites)
      this.renderGame()
    })
  }

  renderGame() {
    this.player.animatePlayer()
    new animateMap(this.canvas, this.ctx)
    setTimeout(()=>this.renderGame(),1000/this.framesDelay)
  }
}

socket.on('connect', () => {
  console.log('> Connected to server')
  new Game()
})
