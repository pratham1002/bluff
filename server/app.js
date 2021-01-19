const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')

const socketio = require('socket.io')
const http = require('http')

const app = express()
// require('./db/mongoose')
const server = http.createServer(app)
const io = socketio(server)

// request logger
const morgan = require('morgan')
app.use(morgan('tiny'))

// Setup static directory to serve
app.use(express.static(path.join(__dirname, '../frontend/build')));

// // admin panel
// const AdminBro = require('admin-bro')
// const AdminBroExpress = require('admin-bro-expressjs')
// const AdminBroMongoose = require('admin-bro-mongoose')

// // models
// const User = require('./models/user')

// // setup admin panel
// AdminBro.registerAdapter(AdminBroMongoose)

// const adminBro = new AdminBro({
//   resources: [
//     User
//   ],
//   rootPath: '/admin'
// })

// const adminPanelRouter = AdminBroExpress.buildRouter(adminBro)

// app.use(adminBro.options.rootPath, adminPanelRouter)

// // routers
// const googleAuth = require('./oauth2/googleAuthRouters')

// app.use(googleAuth)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})
// Next 5 lines help in parsing input and getting req.body
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

// parses cookies and gives an object req.cookies
app.use(cookieParser())

module.exports = { server, io }
