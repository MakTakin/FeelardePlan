
const express = require('express')
const cors = require('cors')

const taskRouter = require('../routers/tasks')
const db = require('../database/database')
const bot = require('./bot')

const app = express()

app.use(cors())

app.use('/api/tasks', taskRouter)


const PORT = process.env.PORT || 8080

async function start() {
  try{
    await db.sync()
    await bot.launch()
    await app.listen(PORT , function() {
    console.log(`Server listens http://localhost:${PORT}`)
})
  } catch (e) {
      console.log(e)
  }
}
start()



