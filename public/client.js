var socket = io('http://localhost:8000');
var audio = new Audio('tone.mp3');

var form = document.getElementById('form');
var input = document.getElementById('text');
var fileInput = document.getElementById('formFile');
var container = document.querySelector('.chatbox');
var username = document.getElementById('nametext');
var btn = document.getElementById('join');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value != '') {
        var message = input.value;
        append(`You: ${message}`, 'right');
        if (input.value) {
            socket.emit('send', message);
            input.value = '';
        }
    }
    else {
        var file = fileInput.value;
        append(`You: ${file}`, 'right');
        if (fileInput.value) {
            socket.emit('send', file);
            fileInput.value = '';
        }
    }
});

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
    append(`${name} joined the chat`, 'right');
});

btn.addEventListener('click', function(e){
    e.preventDefault();
    let n = username.value;
    socket.emit('new-user-joined', n);
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'right');
});