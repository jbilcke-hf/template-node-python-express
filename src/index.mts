import express from 'express'
import { python } from 'pythonia'

// make it easier to import local Python modules
const sys = await python('sys')
await sys.path.insert(0, '.')

const { date } = await python('datetime')

const app = express()
const port = 7860
app.use(express.static('public'))
app.get('/', async (req, res) => {
  const today = await date.today()
  res.write(`<html>
  <head><title>Hello.</title></head>
  <body>
    <div>Python says: today's date is ${
      await today.strftime("%d/%m/%Y")
    }</div>
  </body>
</html>`)
  res.end()
})

process.on('SIGINT', () => {
  try {
    (python as any).exit()
  } catch (err) {
    // exiting Pythonia can get a bit messy: try/catch or not,
    // you *will* see warnings and tracebacks in the console
  }
  process.exit(0)
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })