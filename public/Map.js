const blocksMap = [
  [0, 0]
]

export class animateMap {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx

    this.drawObj('#000000',this.canvas.width/1.8, this.canvas.height-200, 100, 10)
  }

  drawObj(Color, ObjX, ObjY, ObjWidth, ObjHeight) {
    this.ctx.save()
    this.ctx.fillStyle = Color
    this.ctx.fillRect(ObjX, ObjY, ObjWidth, ObjHeight)
    this.ctx.restore()
  }
}
