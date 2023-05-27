import express from 'express';
const app = express();
import { createServer } from 'http';
const port = process.env.PORT || 8000;
const server = createServer(app);
const io = require('socket.io')(server);

app.use(express.static("public"));

const users = [];
let user = {};

const currentUser = (id) => {
    return users.find(user => user.id === id);
};

const getRoomUsers = (room) => {
    return users.filter(user => user.room == room);
}

const deleteUser = (id) => {
    let index = users.findIndex(user => user.id == id);
    if(index != -1) {
        return users.splice(index, 1)[0];
    }
}

io.on('connection', socket => {
    socket.on('new-user-joined', data => {
        user = {id: socket.id, name: data.name, room: data.room};
        users.push(user);

        socket.join(user.room);

        console.log(`${user.name} connected..`);
        console.log(`Room name: ${user.room}`);

        // display user & room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // users[socket.id] = user.name;
        socket.broadcast.to(user.room).emit('user-joined', user.name);

    });

    socket.on('send', message => {
        console.log(message);

        const user = currentUser(socket.id);
        console.log(user);

        //exclude sender
        socket.broadcast.to(user.room).emit('receive', { message: message, name: user.name });
    });

    socket.on('image', data => {
        console.log(data);

        const user = currentUser(socket.id);

        //exclude sender
        socket.broadcast.to(user.room).emit('receive-image', 
            {
              img: data,
              name : user.name
            }
        );
    });

    socket.on('typing', data => {
        socket.broadcast.to(data.room).emit('typing', data.name);
    })

    socket.on('typingEmpty', data => {
        socket.broadcast.to(data.room).emit('typingEmpty');
    })

    socket.on('disconnect', data => {
        const user = deleteUser(socket.id);
        if(user) {
            console.log(`${user.name} disconnected..`);
            socket.broadcast.to(user.room).emit('left', user.name);
            socket.broadcast.to(user.room).emit('typingEmpty');
            console.log(users);
            
            // display user & room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});


server.listen(port, () => {
    console.log(`Server runnning on http://localhost:${port}`);
});
