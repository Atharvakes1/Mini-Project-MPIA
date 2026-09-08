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

// Handle form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Grab both values from the HTML
    const messageText = input.value.trim();
    const senderName = document.getElementById('username-input').value.trim();

    if (messageText && senderName) {
        // Construct the EXACT payload Member 1 expects
        const payload = {
            sender: senderName,
            text: messageText
        };
        
        // Send the object, not just the string
        socket.emit('chatMessage', payload); 
        input.value = ''; // clear field
    }
});

// Listen for messages from server
socket.on('chatMessage', (incomingData) => {
    // incomingData is the object M1 formatted (id, sender, text, timestamp)
    
    const div = document.createElement('div');
    
    // Format how it looks on the screen (e.g., "[11:20 AM] Ayush: Hello")
    div.textContent = `[${incomingData.timestamp}] ${incomingData.sender}: ${incomingData.text}`;
    
    messagesContainer.appendChild(div);
});
