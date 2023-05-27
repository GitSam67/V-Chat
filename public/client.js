var socket = io.connect();
var audio = new Audio('tone.mp3');

var form = document.getElementById('form');
var input = document.getElementById('text');
var fileInput = document.getElementById('formFile');
var container = document.querySelector('.chatbox');
var username = document.getElementById('name');
var roomname = document.getElementById('room');
var btn = document.getElementById('join');
var logout = document.getElementById('logout');
var roomDiv = document.getElementById('roomDiv');
var onlineUsers = document.getElementById('onlineUsers');
var typingUsers = document.getElementById('typingUsers');


btn.addEventListener('click', function(e){
    e.preventDefault();
    let n = username.value;
    let r = roomname.value;
    socket.emit('new-user-joined', {name: n, room: r});
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
        var message = input.value;
        var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
        if (input.value) {
            append(`You: ${time} \n ${message}`, 'right');
            container.scrollTop = container.scrollHeight;
            socket.emit('send', message);
            input.value = '';  
        }
});

input.addEventListener('change', () => {
    if (input.value == "") {
        console.log("empty");
        typingUsers.innerHTML = "";
        socket.emit('typingEmpty', {name: username.value, room: roomname.value});
    }
    else {
        console.log("typing");
        socket.emit('typing', {name: username.value, room: roomname.value});
    }
})

fileInput.addEventListener('change', (e) => {
    const data = URL.createObjectURL(e.target.files[0]);
    console.log(data);
    sendImg(data, 'right');      
});

const sendImg = (data, position) => {
    const box = document.createElement('div');
    const msg = document.createElement('img');
    msg.src = data;
    box.classList.add('imageBox');
    msg.classList.add('image');
    msg.classList.add(position);
    box.classList.add(position);
    var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
    box.append(`You:  ${time} \n`);
    box.appendChild(msg);
    container.append(box);
    container.scrollTop = container.scrollHeight;
    socket.emit('image', data);
}

const append = (message, position) => {
    const msg = document.createElement('div');
    msg.innerText = message;
    msg.classList.add('chat');
    msg.classList.add(position);
    container.append(msg);
    if (position == 'left') {
        audio.play();
    }
};

socket.on('user-joined', name => {
    var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
    append(`${name} joined the chat  ${time}`, 'right');
    container.scrollTop = container.scrollHeight;
});

socket.on('typing', name => {
    typingUsers.innerHTML = ' ' + name + ' is typing...';
})

socket.on('typingEmpty', () => {
    typingUsers.innerHTML = "";
})

socket.on('roomUsers', data => {
    roomDiv.innerText = data.room;
    onlineUsers.innerHTML = `${data.users.map(user => user.name)}`;
});

socket.on('receive', data => {
    var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
    append(`${data.name}:  ${time} \n ${data.message}`, 'left');
    typingUsers.innerHTML = "";
    container.scrollTop = container.scrollHeight;
});

socket.on('receive-image', data => {
    const box = document.createElement('div');
    const msg = document.createElement('img');
    msg.src = data.img;
    box.classList.add('imageBox');
    msg.classList.add('image');
    msg.classList.add('left');
    box.classList.add('left');
    var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
    box.append(`${data.name}:  ${time} \n`);
    box.appendChild(msg);
    container.append(box);
    container.scrollTop = container.scrollHeight;
    audio.play();
});

logout.addEventListener('click', function(e){
    socket.disconnect();
    socket.emit('typingEmpty', {name: username.value, room: roomname.value});
    window.location.reload();
});

socket.on('left', name => {
    var time = new Date().toLocaleTimeString('en-US', {hour: 'numeric', minute:'numeric', hour12:true});
    append(`${name} left the chat  ${time}`, 'right');
    container.scrollTop = container.scrollHeight;
});

