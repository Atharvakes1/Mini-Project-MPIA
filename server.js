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
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // 1. Listen for a 'chatMessage' event from this specific connected user
  socket.on('chatMessage', (messageData) => {
    
    // 2. Log it to the terminal so Member 1 can see it working
    console.log(`Message from ${socket.id}: ${messageData}`);

    // 3. Broadcast that exact message to ALL connected users
    io.emit('chatMessage', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});