const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  maxHttpBufferSize: 5e6, // 5MB max for socket messages (images, files)
  cors: { origin: '*' }
});

// ─── Middleware ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── File Upload Config ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// ─── In-Memory Data Store ────────────────────────────────────
// (Replace with MongoDB Atlas when ready)
const dataStore = {
  users: [],
  chatHistory: [],
  events: [
    { id: 1, title: 'TechFest 2026', club: 'Coding Club', date: '2026-10-15', time: '10:00 AM', location: 'Auditorium', description: 'Annual tech festival with hackathons, workshops, and competitions.', attendees: 45, category: 'Technical', rsvps: [] },
    { id: 2, title: 'Annual Sports Day', club: 'Sports Club', date: '2026-10-20', time: '8:00 AM', location: 'Sports Ground', description: 'Inter-department sports competitions.', attendees: 120, category: 'Sports', rsvps: [] },
    { id: 3, title: 'Cultural Night Diwali', club: 'Cultural Committee', date: '2026-10-28', time: '6:00 PM', location: 'Open Air Theatre', description: 'Celebrate Diwali with performances, food stalls, and fireworks.', attendees: 200, category: 'Cultural', rsvps: [] },
    { id: 4, title: 'Hackathon 3.0', club: 'CSE Department', date: '2026-11-05', time: '9:00 AM', location: 'CS Lab Block B', description: '24-hour coding marathon. Build solutions for real-world problems.', attendees: 60, category: 'Technical', rsvps: [] },
    { id: 5, title: 'Photography Walk', club: 'Photography Club', date: '2026-11-10', time: '4:00 PM', location: 'Campus Garden', description: 'Guided campus photo walk for all skill levels.', attendees: 25, category: 'Cultural', rsvps: [] },
    { id: 6, title: 'AI/ML Workshop', club: 'AI Club', date: '2026-11-15', time: '2:00 PM', location: 'Seminar Hall', description: 'Hands-on workshop on building ML models with Python.', attendees: 40, category: 'Technical', rsvps: [] }
  ],
  clubs: [
    { id: 1, name: 'Coding Club', category: 'Technical', members: 85, description: 'Competitive programming, hackathons, and coding contests.' },
    { id: 2, name: 'Robotics Club', category: 'Technical', members: 45, description: 'Build robots, participate in national competitions.' },
    { id: 3, name: 'Photography Club', category: 'Cultural', members: 60, description: 'Capture campus life through the lens.' },
    { id: 4, name: 'Nritya (Dance Club)', category: 'Cultural', members: 50, description: 'Classical, contemporary, and street dance.' },
    { id: 5, name: 'Debate Society', category: 'Literary', members: 35, description: 'Model UN, debates, and public speaking.' },
    { id: 6, name: 'Sports Club', category: 'Sports', members: 150, description: 'Cricket, football, basketball, and athletics.' },
    { id: 7, name: 'Sargam (Music Club)', category: 'Cultural', members: 40, description: 'Vocal, instrumental, and band performances.' },
    { id: 8, name: 'Rangmanch (Drama Club)', category: 'Cultural', members: 30, description: 'Theatre, street plays, and film-making.' },
    { id: 9, name: 'AI/ML Club', category: 'Technical', members: 55, description: 'Machine learning, deep learning, and AI projects.' },
    { id: 10, name: 'Literary Society', category: 'Literary', members: 25, description: 'Creative writing, poetry slams, and book discussions.' }
  ],
  tasks: [
    { id: 1, title: 'Design Homepage Layout', description: 'Create wireframe and mockup for the Campus Clone homepage.', priority: 'high', currentAssignee: 1, currentStage: 1, totalStages: 4, status: 'in-progress', dueDate: '2026-09-15', completedStages: [], notes: [] },
    { id: 2, title: 'Build Chat Backend', description: 'Implement Socket.io real-time messaging with rooms and history.', priority: 'high', currentAssignee: 3, currentStage: 3, totalStages: 4, status: 'in-progress', dueDate: '2026-09-18', completedStages: [1, 2], notes: [] },
    { id: 3, title: 'Create Login Page', description: 'Build auth UI with college email validation and WebAuthn.', priority: 'medium', currentAssignee: 4, currentStage: 4, totalStages: 4, status: 'completed', dueDate: '2026-09-10', completedStages: [1, 2, 3, 4], notes: [] },
    { id: 4, title: 'API Integration', description: 'Connect frontend to backend APIs for events, clubs, and chat.', priority: 'medium', currentAssignee: 2, currentStage: 2, totalStages: 4, status: 'in-progress', dueDate: '2026-09-20', completedStages: [1], notes: [] },
    { id: 5, title: 'Test & Deploy', description: 'End-to-end testing and deployment to production server.', priority: 'low', currentAssignee: 1, currentStage: 1, totalStages: 4, status: 'pending', dueDate: '2026-09-25', completedStages: [], notes: [] }
  ],
  reels: [
    { id: 1, creator: 'campus_official', creatorName: 'Campus Official', description: 'Welcome to GL Bajaj! Campus Tour 🏫', hashtags: ['#campustour', '#glbajaj', '#college'], likes: 234, comments: 18 },
    { id: 2, creator: 'coding_club', creatorName: 'Coding Club', description: 'TechFest Highlights 🎉 What an amazing event!', hashtags: ['#techfest', '#hackathon', '#coding'], likes: 189, comments: 24 },
    { id: 3, creator: 'nritya_club', creatorName: 'Nritya Dance Club', description: 'Dance Practice 💃 Getting ready for Cultural Night', hashtags: ['#dance', '#nritya', '#culturalnight'], likes: 312, comments: 42 },
    { id: 4, creator: 'cse_dept', creatorName: 'CSE Department', description: 'Lab Day Vibes 🔬 AI/ML workshop in action', hashtags: ['#cse', '#aiml', '#labday'], likes: 156, comments: 12 },
    { id: 5, creator: 'sports_club', creatorName: 'Sports Club', description: 'Sports Day 2026 ⚽ Inter-department finals!', hashtags: ['#sportsday', '#cricket', '#football'], likes: 278, comments: 35 }
  ],
  chatRooms: [
    { id: 'cse-a-official', name: 'CSE-A Official', type: 'group', members: [], admins: [], description: 'Official group for CSE Section A' },
    { id: 'coding-club', name: 'Coding Club', type: 'group', members: [], admins: [], description: 'All things code!' },
    { id: 'campus-events', name: 'Campus Events', type: 'group', members: [], admins: [], description: 'Stay updated with campus events' },
    { id: 'ai-study-group', name: 'AI Study Group', type: 'group', members: [], admins: [], description: 'Discuss AI/ML topics' },
    { id: 'sports-community', name: 'Sports Community', type: 'community', members: [], admins: [], description: 'For all sports enthusiasts' }
  ]
};

const MAX_CHAT_HISTORY = 200;
const connectedUsers = new Map(); // socketId -> userInfo

// ─── Create uploads directory ────────────────────────────────
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ═══════════════════════════════════════════════════════════════
// REST API ROUTES
// ═══════════════════════════════════════════════════════════════

// ─── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Campus Clone server is running! 🚀',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    connectedUsers: connectedUsers.size
  });
});

// ─── AUTH ROUTES ─────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, studentId, branch, year } = req.body;

  // Validate college email
  if (!email || !email.endsWith('@glbitm.ac.in')) {
    return res.status(400).json({ error: 'Only @glbitm.ac.in email addresses are allowed.' });
  }

  // Check if user already exists
  if (dataStore.users.find(u => u.email === email)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  // Create user (in production, hash password with bcrypt)
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password, // TODO: Hash with bcrypt in production
    studentId: studentId || '',
    branch: branch || '',
    year: year || '',
    role: 'member',
    createdAt: new Date().toISOString()
  };

  dataStore.users.push(user);

  // Return user without password
  const { password: _, ...safeUser } = user;
  res.status(201).json({ user: safeUser, message: 'Registration successful!' });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.endsWith('@glbitm.ac.in')) {
    return res.status(400).json({ error: 'Only @glbitm.ac.in email addresses are allowed.' });
  }

  const user = dataStore.users.find(u => u.email === email && u.password === password);
  if (!user) {
    // For demo: auto-create user on first login
    const newUser = {
      id: Date.now().toString(),
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      password,
      studentId: '',
      branch: 'CSE',
      year: '2',
      role: 'member',
      createdAt: new Date().toISOString()
    };
    dataStore.users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return res.json({ user: safeUser, message: 'Login successful!' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ user: safeUser, message: 'Login successful!' });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || !email.endsWith('@glbitm.ac.in')) {
    return res.status(400).json({ error: 'Please enter a valid @glbitm.ac.in email.' });
  }
  // Simulate sending reset email
  res.json({ message: 'Password reset link sent to ' + email });
});

// ─── EVENTS ROUTES ──────────────────────────────────────────
app.get('/api/events', (req, res) => {
  res.json(dataStore.events);
});

app.post('/api/events', (req, res) => {
  const event = {
    id: Date.now(),
    ...req.body,
    attendees: 0,
    rsvps: [],
    createdAt: new Date().toISOString()
  };
  dataStore.events.push(event);
  res.status(201).json(event);
});

app.post('/api/events/:id/rsvp', (req, res) => {
  const event = dataStore.events.find(e => e.id === parseInt(req.params.id));
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const { userId } = req.body;
  const idx = event.rsvps.indexOf(userId);
  if (idx > -1) {
    event.rsvps.splice(idx, 1);
    event.attendees = Math.max(0, event.attendees - 1);
    res.json({ rsvpd: false, attendees: event.attendees });
  } else {
    event.rsvps.push(userId);
    event.attendees++;
    res.json({ rsvpd: true, attendees: event.attendees });
  }
});

// ─── CLUBS ROUTES ───────────────────────────────────────────
app.get('/api/clubs', (req, res) => {
  res.json(dataStore.clubs);
});

app.post('/api/clubs/:id/join', (req, res) => {
  const club = dataStore.clubs.find(c => c.id === parseInt(req.params.id));
  if (!club) return res.status(404).json({ error: 'Club not found' });
  club.members++;
  res.json({ joined: true, members: club.members });
});

app.post('/api/clubs/:id/leave', (req, res) => {
  const club = dataStore.clubs.find(c => c.id === parseInt(req.params.id));
  if (!club) return res.status(404).json({ error: 'Club not found' });
  club.members = Math.max(0, club.members - 1);
  res.json({ joined: false, members: club.members });
});

// ─── TASKS ROUTES ───────────────────────────────────────────
app.get('/api/tasks', (req, res) => {
  res.json(dataStore.tasks);
});

app.post('/api/tasks', (req, res) => {
  const task = {
    id: Date.now(),
    ...req.body,
    currentAssignee: 1, // Always start with Member 1
    currentStage: 1,
    totalStages: 4,
    status: 'pending',
    completedStages: [],
    notes: [],
    createdAt: new Date().toISOString()
  };
  dataStore.tasks.push(task);
  res.status(201).json(task);
});

app.post('/api/tasks/:id/handoff', (req, res) => {
  const task = dataStore.tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const { note, verifiedBy } = req.body;

  // Mark current stage as complete
  task.completedStages.push(task.currentStage);

  if (task.currentStage >= task.totalStages) {
    task.status = 'completed';
    task.currentStage = task.totalStages;
  } else {
    task.currentStage++;
    task.currentAssignee = task.currentStage; // Member N for stage N
    task.status = 'in-progress';
  }

  if (note) {
    task.notes.push({
      from: verifiedBy,
      note,
      timestamp: new Date().toISOString()
    });
  }

  // Notify via socket
  io.emit('taskUpdate', task);

  res.json(task);
});

// ─── REELS ROUTES ───────────────────────────────────────────
app.get('/api/reels', (req, res) => {
  res.json(dataStore.reels);
});

app.post('/api/reels/:id/like', (req, res) => {
  const reel = dataStore.reels.find(r => r.id === parseInt(req.params.id));
  if (!reel) return res.status(404).json({ error: 'Reel not found' });
  reel.likes++;
  res.json({ likes: reel.likes });
});

// ─── AI CHATBOT ROUTE ───────────────────────────────────────
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;

  // Campus-specific knowledge base for fallback responses
  const knowledgeBase = {
    events: 'Check the Events page for upcoming campus events! We have TechFest, Sports Day, Cultural Night, and more coming up.',
    library: 'The Central Library is in Block A, Ground Floor. Open Monday-Saturday: 9 AM - 8 PM. Digital library access available 24/7.',
    clubs: 'GL Bajaj has 10+ active clubs! Visit the Events & Clubs page to browse and join. Popular ones include Coding Club, Robotics Club, and Nritya Dance Club.',
    wifi: 'Campus WiFi: Connect to GLBAJAJ-STUDENT network. Get your login credentials from the IT Help Desk in Block C.',
    canteen: 'Main Canteen (Block D): 8 AM - 6 PM. Night Canteen: 7 PM - 11 PM. Juice Corner near the garden is open all day.',
    hostel: 'Hostel applications are accepted at the start of each semester. Visit the Dean of Students office in Admin Block for forms.',
    hod: 'HOD of CSE: Visit the department page on the college website for current faculty details.',
    exam: 'Exam schedules are posted on the notice board and college portal. Mid-semester exams are usually in weeks 7-8.',
    placement: 'The Training & Placement Cell is in Admin Block, 2nd Floor. Pre-placement training starts in 6th semester.',
    transport: 'College buses run from Noida, Greater Noida, and Ghaziabad. Route details available at the Transport Office.'
  };

  // Try to match with knowledge base
  const lowerMsg = message.toLowerCase();
  let response = null;

  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (lowerMsg.includes(key)) {
      response = value;
      break;
    }
  }

  if (!response) {
    // General fallback for demo (in production, call Gemini API here)
    // To use Gemini API: 
    // const { GoogleGenerativeAI } = require('@google/generative-ai');
    // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    // const result = await model.generateContent(message);
    // response = result.response.text();

    const generalResponses = [
      "That's a great question! I'm your Campus AI Assistant for GL Bajaj. I can help with information about **events**, **clubs**, **library**, **canteen**, **hostel**, **exams**, **placements**, and more!",
      "I'm still learning about that topic! Try asking me about:\n- Campus events and fests\n- Club memberships\n- Library timings\n- Canteen hours\n- Hostel applications\n- Exam schedules",
      "Hmm, I don't have specific information about that yet. Would you like to know about upcoming **events**, how to join **clubs**, or other **campus facilities**?"
    ];
    response = generalResponses[Math.floor(Math.random() * generalResponses.length)];
  }

  // Simulate AI thinking delay
  setTimeout(() => {
    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  }, 800 + Math.random() * 1200); // 0.8s - 2s delay
});

// ─── TRANSLATE ROUTE ────────────────────────────────────────
app.post('/api/translate', async (req, res) => {
  const { text, targetLang = 'hi' } = req.body;

  // Stub: In production, use LibreTranslate or Google Translate API
  // For now, return a placeholder
  const translations = {
    hi: '[Hindi Translation] ',
    es: '[Spanish Translation] ',
    fr: '[French Translation] ',
    de: '[German Translation] ',
    ja: '[Japanese Translation] '
  };

  const prefix = translations[targetLang] || '[Translated] ';
  res.json({
    original: text,
    translated: prefix + text,
    targetLang
  });
});

// ─── FILE UPLOAD ────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  res.json({
    url: `/uploads/${req.file.filename}`,
    name: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype
  });
});

// ═══════════════════════════════════════════════════════════════
// SOCKET.IO REAL-TIME
// ═══════════════════════════════════════════════════════════════
io.on('connection', (socket) => {
  console.log('✦ User connected:', socket.id);

  // ─── User Registration ───
  socket.on('registerUser', (userInfo) => {
    connectedUsers.set(socket.id, {
      ...userInfo,
      socketId: socket.id,
      online: true
    });

    // Notify others
    socket.broadcast.emit('userOnline', {
      id: socket.id,
      name: userInfo.name,
      timestamp: new Date().toISOString()
    });

    // Send current online users
    socket.emit('onlineUsers', Array.from(connectedUsers.values()));

    console.log(`  → ${userInfo.name} registered`);
  });

  // ─── Chat History ───
  socket.emit('loadHistory', dataStore.chatHistory.slice(-50));

  // ─── System Messages ───
  socket.broadcast.emit('systemMessage', {
    text: 'A new user has joined the chat.',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  // ─── Chat Messages ───
  socket.on('chatMessage', (incomingData) => {
    const messagePayload = {
      id: crypto.randomBytes(8).toString('hex'),
      socketId: socket.id,
      sender: incomingData.sender,
      text: incomingData.text,
      type: incomingData.type || 'text', // text, image, file, gif, voice
      room: incomingData.room || 'general',
      replyTo: incomingData.replyTo || null,
      attachment: incomingData.attachment || null,
      encrypted: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: new Date().toISOString()
    };

    dataStore.chatHistory.push(messagePayload);
    if (dataStore.chatHistory.length > MAX_CHAT_HISTORY) {
      dataStore.chatHistory.shift();
    }

    // Broadcast to the specific room or to all
    if (incomingData.room) {
      io.to(incomingData.room).emit('chatMessage', messagePayload);
    } else {
      io.emit('chatMessage', messagePayload);
    }
  });

  // ─── Join Room ───
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`  → ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('systemMessage', {
      text: `${connectedUsers.get(socket.id)?.name || 'A user'} joined the chat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // ─── Leave Room ───
  socket.on('leaveRoom', (roomId) => {
    socket.leave(roomId);
    socket.to(roomId).emit('systemMessage', {
      text: `${connectedUsers.get(socket.id)?.name || 'A user'} left the chat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });

  // ─── Private Message ───
  socket.on('privateMessage', (data) => {
    const { targetSocketId, sender, text, type, attachment } = data;
    const messagePayload = {
      id: crypto.randomBytes(8).toString('hex'),
      socketId: socket.id,
      sender,
      text,
      type: type || 'text',
      attachment: attachment || null,
      encrypted: true,
      private: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fullTimestamp: new Date().toISOString()
    };

    // Send to target and back to sender
    io.to(targetSocketId).emit('privateMessage', messagePayload);
    socket.emit('privateMessage', messagePayload);
  });

  // ─── Typing Indicator ───
  socket.on('typing', (data) => {
    if (data.room) {
      socket.to(data.room).emit('typing', {
        user: data.user || connectedUsers.get(socket.id)?.name || 'Someone',
        room: data.room
      });
    } else {
      socket.broadcast.emit('typing', {
        user: data.user || connectedUsers.get(socket.id)?.name || 'Someone'
      });
    }
  });

  socket.on('stopTyping', (data) => {
    if (data.room) {
      socket.to(data.room).emit('stopTyping', { room: data.room });
    } else {
      socket.broadcast.emit('stopTyping', {});
    }
  });

  // ─── Read Receipts ───
  socket.on('messageRead', (data) => {
    const { messageId, readBy } = data;
    io.emit('messageRead', { messageId, readBy });
  });

  // ─── Task Updates ───
  socket.on('taskUpdate', (task) => {
    const idx = dataStore.tasks.findIndex(t => t.id === task.id);
    if (idx > -1) {
      dataStore.tasks[idx] = task;
    }
    io.emit('taskUpdate', task);
  });

  // ─── Disconnect ───
  socket.on('disconnect', () => {
    const user = connectedUsers.get(socket.id);
    connectedUsers.delete(socket.id);

    console.log('✧ User disconnected:', user?.name || socket.id);

    io.emit('userOffline', {
      id: socket.id,
      name: user?.name || 'Unknown',
      timestamp: new Date().toISOString()
    });

    io.emit('systemMessage', {
      text: `${user?.name || 'A user'} has left the chat.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════╗
  ║   🎓 Campus Clone - MPIA Server Running     ║
  ║   📡 http://localhost:${PORT}                  ║
  ║   ⚡ Socket.io: Active                       ║
  ║   📊 API Routes: 15 endpoints                ║
  ╚══════════════════════════════════════════════╝
  `);
});