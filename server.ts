import * as express from 'express'
import { createServer } from 'http'

let __dirname: string

const app = express()
const httpServer = createServer(app)

app.use(express.static(__dirname + '/public'))
app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})

httpServer.listen(3000, () => console.log('game started'))

export default httpServer
