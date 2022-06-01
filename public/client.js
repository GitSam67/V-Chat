var socket = io.connect();
var audio = new Audio('tone.mp3');

var form = document.getElementById('form');
var input = document.getElementById('text');
var fileInput = document.getElementById('formFile');
var container = document.querySelector('.chatbox');
var username = document.getElementById('nametext');
var btn = document.getElementById('join');
var logout = document.getElementById('logout');

form.addEventListener('submit', (e) => {
    e.preventDefault();
        var message = input.value;
        append(`You \n ${message}`, 'right');
        container.scrollTop = container.scrollHeight;
        if (input.value) {
            socket.emit('send', message);
            input.value = '';
        }
});

fileInput.addEventListener('click', (e) =>{
    e.preventDefault();

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
    container.scrollTop = container.scrollHeight;
});

btn.addEventListener('click', function(e){
    e.preventDefault();
    let n = username.value;
    socket.emit('new-user-joined', n);
});

socket.on('receive', data => {
    append(`${data.name} \n ${data.message}`, 'left');
    container.scrollTop = container.scrollHeight;
});

socket.on('permit', user =>{
    alert(`${user} wants to join in..`);
    append(`${user} joined the chat`, 'right');
    container.scrollTop = container.scrollHeight;
});

logout.addEventListener('click', function(e){
    socket.disconnect();
    window.location.reload();
});
socket.on('left', name => {
    append(`${name} left the chat`, 'right');
    container.scrollTop = container.scrollHeight;
});

