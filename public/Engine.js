
import animatePlayer from './Player.js'
import animateMap from './Map.js'

const socket = window.io()

export default class Game {
  canvas = document.querySelector('canvas')
  ctx = this.canvas.getContext('2d')
  framesDelay = 1000/60
  blocks = [
    [0,557,64,64],
    [64,557,64,64],
    [128,557,64,64],
    [192,557,64,64],
  ]
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
    const animate = new animateMap(this.canvas, this.ctx)
    setTimeout(()=>this.renderGame(),this.framesDelay)
  }
}

socket.on('connect', () => {
  console.log('> Connected to server')
  document.game = new Game()
})
