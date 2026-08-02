const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files (your index.html + client.js)
app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  // Listen for chatMessage from client
  socket.on('chatMessage', (msg) => {
    console.log('Message received:', msg);
    // Broadcast to all clients
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
