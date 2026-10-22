const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let currentPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// In-memory state (no database)
// Map: socket.id -> { username, joinedAt }
const activeUsers = new Map();

io.on('connection', (socket) => {
  // Send initial online count to the connecting client
  socket.emit('users:count', { onlineCount: activeUsers.size });

  // Handle user joining the chat with a specific name
  socket.on('user:join', (data, callback) => {
    const rawName = typeof data === 'string' ? data : data?.username;
    const username = (rawName || '').trim();

    if (!username) {
      if (typeof callback === 'function') {
        return callback({ success: false, error: 'Name cannot be empty.' });
      }
      return;
    }

    if (username.length > 25) {
      if (typeof callback === 'function') {
        return callback({ success: false, error: 'Name must be 25 characters or fewer.' });
      }
      return;
    }

    // Save user session in memory
    socket.data.username = username;
    activeUsers.set(socket.id, {
      username,
      joinedAt: new Date()
    });

    const userList = Array.from(activeUsers.values()).map((u) => u.username);
    const onlineCount = activeUsers.size;

    // Acknowledge to the sender
    if (typeof callback === 'function') {
      callback({
        success: true,
        username,
        onlineCount,
        onlineUsers: userList
      });
    }

    // Notify all other clients that a new user joined
    socket.broadcast.emit('user:joined', {
      username,
      timestamp: Date.now(),
      onlineCount
    });

    // Broadcast updated users list
    io.emit('users:update', {
      onlineCount,
      onlineUsers: userList
    });
  });

  // Handle sending a chat message
  socket.on('chat:message', (data) => {
    const username = socket.data.username;
    if (!username) {
      return socket.emit('error', { message: 'You must join with a name first.' });
    }

    const rawText = typeof data === 'string' ? data : data?.text;
    const text = (rawText || '').trim();

    if (!text) return;

    // Create message object
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      sender: username,
      senderId: socket.id,
      text: text.slice(0, 1000), // Protect against overly long payloads
      timestamp: new Date().toISOString()
    };

    // Broadcast message to all connected clients including sender
    io.emit('chat:message', message);
  });

  // Handle typing indicator
  socket.on('user:typing', (isTyping) => {
    const username = socket.data.username;
    if (username) {
      socket.broadcast.emit('user:typing', {
        username,
        isTyping: Boolean(isTyping)
      });
    }
  });

  // Handle intentional leave
  socket.on('user:leave', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      delete socket.data.username;

      const userList = Array.from(activeUsers.values()).map((u) => u.username);
      const onlineCount = activeUsers.size;

      // Broadcast user left
      socket.broadcast.emit('user:left', {
        username: user.username,
        timestamp: Date.now(),
        onlineCount
      });

      io.emit('users:update', {
        onlineCount,
        onlineUsers: userList
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);

      const userList = Array.from(activeUsers.values()).map((u) => u.username);
      const onlineCount = activeUsers.size;

      socket.broadcast.emit('user:left', {
        username: user.username,
        timestamp: Date.now(),
        onlineCount
      });

      io.emit('users:update', {
        onlineCount,
        onlineUsers: userList
      });
    }
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`[Chat Server] Running at http://localhost:${portToTry}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`[Chat Server] Port ${currentPort} is busy, trying port ${currentPort + 1}...`);
    currentPort += 1;
    startServer(currentPort);
  } else {
    console.error('[Chat Server] Error starting server:', err);
  }
});

startServer(currentPort);

