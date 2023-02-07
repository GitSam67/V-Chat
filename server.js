const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });


app.post("/upload", upload.single("image"), (req, res) => {
  io.emit("image", { image: true, buffer: req.file.buffer });
  res.send();
});

const users = {};
var count = 0;

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        count++;
        if (count != 1) {
            console.log(`${name} connected..`);
            users[socket.id] = name;
            socket.broadcast.emit('permit', name);
        } else {
            console.log(`${name} connected..`);
            users[socket.id] = name;
            socket.broadcast.emit('user-joined', name);
        }
    });

    socket.on('send', message => {
        console.log(message);
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on("image", data => {
        io.emit("image", data);
      });

    socket.on('disconnect', data => {
        console.log(`${users[socket.id]} disconnected..`);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

app.use(express.static("public"));

server.listen(8000, () => {
    console.log("Server runnning on http://localhost:8000");
});
