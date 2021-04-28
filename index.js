const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIo = require('socket.io')
const io = socketIo(server)
const path = require("path")

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on("connection", (socket) => {
    console.log("running")

    socket.on("newUser", (name) => {
        socket.broadcast.emit("newUser", name)
    })
    socket.on("messageEvent", (obj) => {
        io.sockets.emit("messageEvent", obj)
    })
    socket.on('typing', ({name, typing}) => {
        socket.broadcast.emit('typing', {name, typing})
    })

    socket.on("closeEvent", (name) => {
        socket.broadcast.emit("closeEvent", name)
    })
})

server.listen(3000, () => console.log('66 listening'))