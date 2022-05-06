const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name=>{
        console.log(`${name} connected..`);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message=>{
        console.log(message);
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', data=>{
        console.log(`${users[socket.id]} disconnected..`);
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});

server.listen(8000, ()=>{
    console.log("Server runnning on http://localhost:8000");
});
