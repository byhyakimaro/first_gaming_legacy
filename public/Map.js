export default class Map {
  constructor (canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx

    this.drawObj('black', 0, 0, canvas.width, canvas.height)
    for (const [x, y, w, h] of document.game.blocks) {
      this.drawObj('white', x, y, w, h)
    }
  }

  drawObj (Color, ObjX, ObjY, ObjWidth, ObjHeight) {
    this.ctx.save()
    this.ctx.fillStyle = Color
    this.ctx.fillRect(ObjX, ObjY, ObjWidth, ObjHeight)
    this.ctx.restore()
  }
}
