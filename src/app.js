import express from 'express'
import routes from './routes'
// import { resolve } from 'path'
import cors from 'cors'

import * as dotenv from 'dotenv'

import './database'
dotenv.config()

class App {
  constructor() {
    this.app = express()

    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(cors())
  }

  routes() {
    this.app.use(routes)
  }
}

export default new App().app
