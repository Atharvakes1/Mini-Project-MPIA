const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static frontend files from the public directory
app.use(express.static('public'));

// Test route to verify the server is active
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running smoothly!' });
});

// Basic Socket.io connection listener/ This array acts as our temporary database
const chatHistory = [];

// We only want to keep the most recent 50 messages
const MAX_HISTORY = 50;
// Basic Socket.io connection listener
// Basic Socket.io connection listener
io.on('connection', (socket) => {
  // Send existing history to the newly connected user
    socket.emit('loadHistory', chatHistory);
  console.log('A user connected:', socket.id);

  // 1. SYSTEM ALERT: Tell everyone ELSE that a new user arrived
  socket.broadcast.emit('systemMessage', 'A new user has joined the chat.');

  // The chat payload logic from Day 3
  // We expect 'incomingData' to be an object: { sender: "Name", text: "Message" }
socket.on('chatMessage', (incomingData) => {
    
    // The payload perfectly matches the agreed JSON blueprint
    const messagePayload = {
        id: socket.id,
        sender: incomingData.sender, // Extracted from the frontend payload
        text: incomingData.text,     // Extracted from the frontend payload
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    // Save it to the temporary memory bank
    chatHistory.push(messagePayload);
    
    // Keep the array from growing infinitely
    if (chatHistory.length > MAX_HISTORY) {
        chatHistory.shift(); 
    }

    
    // Broadcast the properly formatted payload to all connected clients
    io.emit('chatMessage', messagePayload);
});


  // 2. SYSTEM ALERT: Detect when someone closes their tab
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Tell the remaining users that someone left
    io.emit('systemMessage', 'A user has left the chat.');
  });
});


const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});