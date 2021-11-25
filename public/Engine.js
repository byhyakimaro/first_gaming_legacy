import Player from './Player.js'
import Map from './Map.js'

const socket = window.io()

export default class Game {
  timeCurrent = Date.now()
  canvas = document.querySelector('canvas')
  ctx = this.canvas.getContext('2d')
  framesDelay = 1000/60
  blocks = [
    [64,557,64,64],
    [128,557,64,64],
    [192,557,64,64],
    [256,557,64,64]
  ]

  constructor() {
    this.eventConnection()
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  eventConnection() {
    if (localStorage.getItem('token') === null) {
      socket.emit('register', 'Hyakimaro')
      socket.on('newRegister', (data) => {
        localStorage.setItem('token', data)
      })
    } else {
      socket.emit('login', localStorage.getItem('token'))
      socket.on('join', (data) => {
        this.data = data
        this.setSprites()
      })
      socket.on('failedLogin', () => {
        localStorage.removeItem('token')
        this.eventConnection()
      })
    }
  }

  drawText(Color, Text, textX, textY) {
    this.ctx.save()
    this.ctx.fillStyle = Color
    this.ctx.font = "20px pixel"
    this.ctx.fillText(Text, textX, textY)
    this.ctx.restore()
  }

  setSprites() {
    socket.emit('getSprites')
    socket.on('callbackSprites',(sprites)=>{
      this.player = new Player(this.canvas, this.ctx, sprites, this.data)
      this.renderGame()
    })
  }

  renderGame() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    new Map(this.canvas, this.ctx)

    let nowTime = Date.now()
    var fps = Math.round(1000 / (nowTime - this.timeCurrent))
    this.timeCurrent = nowTime
    this.drawText('white', `x: ${Math.round(this.player.coordinates['x'])} y: ${Math.round(this.player.coordinates['y'])} fps: ${fps}`, 10, 30)

    this.drawText(this.player.playerData.hex,`${this.player.playerData.nick}${this.player.playerData.hex}`,this.player.coordinates['x']-20,this.player.coordinates['y']-40)

    this.player.animatePlayer()
    setTimeout(()=>this.renderGame(),this.framesDelay)
  }
}

socket.on('connect', () => {
  console.log('> Connected to server')
  document.game = new Game()
})
