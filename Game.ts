import { createCanvas, loadImage } from 'canvas'
import * as fs from 'fs'

const width = 1200
const height = 749

const gaming = createCanvas(width, height)
const ctx = gaming.getContext('2d')

export class Game {
  
  public pixelSteps: number = 4
  public fps: number = 0
  public oldTime: number = Date.now()
  public playerWidth: number
  public playerHeight: number 
  public sockets = []
  public playerFrameI: number = 0
  public actionPlayer: string = 'Idle'
  public isColliding: boolean = false
  public playerY: number = height/2
  public playerX: number = width/2
  public fly: boolean = false

  constructor () {
    this.Scene()
    this.player(this.playerX, this.playerY)
    this.UpdateGame()
  }

  Scene () {
    ctx.fillStyle = '#764abc'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#000000'
    ctx.fillRect(width/1.8, height-200, 100, 10)
    this.checkCollision(width/1.8, height-200, 100, 10)
  }
  async player(x: number, y: number) {
    this.playerFrameI = this.playerFrameI + 1
    const skinPlayer = 1
    const basePath =`public/images/SpritesPlayer/Reaper_Man_${skinPlayer}/${this.actionPlayer}/`
    const sprites = fs.readdirSync(basePath)
    if(this.playerFrameI >= sprites.length) this.playerFrameI = 0
    const frame = `${basePath}0_Reaper_Man_Walking_${this.playerFrameI}.png`
    const player = await loadImage(frame)
    this.playerWidth = player.width/8
    this.playerHeight = player.height/8
    this.UpdateScene()
    ctx.drawImage(player,x, y, this.playerWidth, this.playerHeight)
  }

  UpdateScene () {
    ctx.clearRect(0, 0, width, height)
    this.Scene()
  }

  UpdateGame() {
    let nowTime = Date.now()
    this.fps = Math.round(1000 / (nowTime - this.oldTime))
    this.oldTime = nowTime
    this.sockets.forEach(socket => {
      socket.emit('scene', gaming.toDataURL())
    })
    this.gravity(10)
    console.log(`x: ${this.playerX}, y: ${this.playerY}, isColliding: ${this.isColliding}, isFlying: ${this.fly} , fps: ${this.fps}`)
    setImmediate(()=>this.UpdateGame())
  }

  gravity (gravity: number) {
    if(!this.fly && !this.isColliding) {
      this.playerY = this.playerY + gravity
    }
    
    const floor = gaming.height - this.playerHeight
    if (this.playerY > floor) {
      this.playerY = floor
    }
    this.player(this.playerX,this.playerY)
  }

  checkCollision (ObjX:number, ObjY:number, ObjWidth:number, ObjHeight:number) {
    const playerLeft = this.playerX
    const playerRight = this.playerX + this.playerWidth
    const playerTop = this.playerY
    const playerBottom = this.playerY + this.playerHeight
    const objLeft = ObjX
    const objRight = ObjX + ObjWidth
    const objTop = ObjY
    const objDown = ObjY + ObjHeight
    if((playerBottom < objTop) || (playerTop > objDown) || (playerRight < objLeft) || (playerLeft > objRight)) {
      this.isColliding = false
    } else {
      this.isColliding = true
    }
  }
}
