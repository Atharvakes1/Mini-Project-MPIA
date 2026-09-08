const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`⚡ Socket connected: ${socket.id}`);

    // User joins their personal room
    socket.on('setup', (userData) => {
      socket.join(userData._id);
      socket.emit('connected');
      console.log(`👤 User setup: ${userData.name}`);
    });

    // Join a chat room
    socket.on('join chat', (room) => {
      socket.join(room);
      console.log(`📢 User joined room: ${room}`);
    });

    // Leave a chat room
    socket.on('leave chat', (room) => {
      socket.leave(room);
    });

    // New message — broadcast to all users in chat
    socket.on('new message', (newMessage) => {
      const chat = newMessage.chat;
      if (!chat.users) return;

      chat.users.forEach((user) => {
        if (user._id === newMessage.sender._id) return;
        socket.in(user._id).emit('message received', newMessage);
      });
    });

    // Typing indicators
    socket.on('typing', (room) => {
      socket.in(room).emit('typing', room);
    });

    socket.on('stop typing', (room) => {
      socket.in(room).emit('stop typing', room);
    });

    // Relay task advancement notification
    socket.on('task advanced', (data) => {
      const { nextUserId, task } = data;
      if (nextUserId) {
        socket.in(nextUserId).emit('task notification', {
          message: `Your turn! Stage ${task.currentStage} of "${task.title}" is now active.`,
          task,
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export default setupSocket;
