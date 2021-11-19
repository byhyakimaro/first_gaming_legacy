export default class animateMap {
  blocksMap = [
    [581,549,10,200],
    [470,549,120,10],
    [670,400,120,120],
  ]

  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx

    for(const [ x, y, w, h ] of this.blocksMap) {
      this.drawObj('#000000',x,y,w,h)
    }
  }

  drawObj(Color, ObjX, ObjY, ObjWidth, ObjHeight) {
    this.ctx.save()
    this.ctx.fillStyle = Color
    this.ctx.fillRect(ObjX, ObjY, ObjWidth, ObjHeight)
    this.ctx.restore()
  }
}
