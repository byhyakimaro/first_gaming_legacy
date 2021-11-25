import * as fs from 'fs'

export function getSprites() {
  const array = []
  const actionPlayer = fs.readdirSync(`public/images/SpritesPlayer/Reaper_Man_1/`)
  actionPlayer.forEach(file => {
    const basePath =`public/images/SpritesPlayer/Reaper_Man_1/${file}/`
    const sprites = fs.readdirSync(basePath)
      array.unshift({action:file, sprites: sprites.length})
  })
  return array
}

export function uuid() {
  return (
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16)+
  (Math.random()*7**20).toString(16))
}

export function setRegister(nick?) {
  if(!nick) nick = 'Guest'
  const token = uuid()
  const hex = `#${Math.floor(Math.random()*16777215).toString(16)}`.toUpperCase()

  return { skin: 1, nick, hex, token }
}