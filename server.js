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

// Basic Socket.io connection listener
// Basic Socket.io connection listener
// Basic Socket.io connection listener
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 1. SYSTEM ALERT: Tell everyone ELSE that a new user arrived
  socket.broadcast.emit('systemMessage', 'A new user has joined the chat.');

  // The chat payload logic from Day 3
  socket.on('chatMessage', (msg) => {
    const messagePayload = {
      id: socket.id,
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
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