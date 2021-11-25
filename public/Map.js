export default class animateMap {

  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx

    for(const [ x, y, w, h ] of document.game.blocks) {
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
