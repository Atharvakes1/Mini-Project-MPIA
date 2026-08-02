// Connect to server
const socket = io();

// Confirm connection
socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

// Handle form submit
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const messagesContainer = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = input.value.trim();
  if (message) {
    socket.emit('chatMessage', message); // send to server
    input.value = ''; // clear field
  }
});

// Listen for messages from server
socket.on('chatMessage', (msg) => {
  const div = document.createElement('div');
  div.textContent = msg;
  messagesContainer.appendChild(div);
})