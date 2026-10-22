# PulseChat — Real-Time Chat with Node.js, Express & Socket.io

A simple, fast, and modern real-time chat application built with **Node.js**, **Express**, and **Socket.io** without any database.

---

## 🌟 Key Features

1. **Two-View User Experience**:
   - **View 1: Join View**: Clean onboarding card where users choose their display name before entering. Shows live room status and active member count.
   - **View 2: Chat Room**: Real-time lounge where users exchange messages, see active members, and check typing indicators.

2. **Zero Database (In-Memory State)**:
   - User sessions and presence are managed entirely in-memory using Node.js and Socket.io.
   - Dynamic user list updates when people join, disconnect, or leave.

3. **Real-Time Communication (Socket.io)**:
   - Instant broadcast of chat messages to all connected participants.
   - Distinct styling for own messages (right-aligned, gradient) vs. other members' messages (left-aligned with custom avatar).
   - System notifications when someone joins or leaves the room.
   - Real-time typing indicators (*"Alice is typing..."*).

4. **Modern Design & Micro-Interactions**:
   - Glassmorphism dark mode with ambient glows.
   - Quick emoji reaction toolbar (`👋`, `👍`, `🔥`, `🎉`, `❤️`, `😂`).
   - Web Audio API synthesized audio notifications (soft chime on new message, join sound) with mute toggle.
   - Active participants dropdown menu.
   - Smooth auto-scroll with "New messages below" indicator if scrolled up.
   - Fully responsive for mobile and desktop screens.

---

## 📁 Project Structure

```
03-socket io - chat/
├── public/
│   ├── index.html        # Single-page application with View 1 (Join) and View 2 (Chat)
│   ├── css/
│   │   └── style.css     # Modern styling, responsive layout, glassmorphic UI
│   └── js/
│       └── client.js     # Client Socket.io events, DOM handling & synthesized audio
├── server.js             # Express server + Socket.io event handling & in-memory state
├── test-e2e.js           # Automated end-to-end test script
├── package.json          # Node dependencies and npm scripts
└── README.md
```

---

## 🚀 How to Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```
*(or run `npm run dev` for auto-reloading during development)*

The server will start at:
```
http://localhost:3000
```
*(If port 3000 is occupied, it automatically shifts to port 3001)*

### 3. Test with Multiple Users
1. Open `http://localhost:3000` (or `3001`) in **Tab 1** and join as **Alice**.
2. Open `http://localhost:3000` (or `3001`) in **Tab 2** (or Incognito window) and join as **Bob**.
3. Send messages back and forth to see instant real-time synchronization, typing status, and system alerts!

---

## 🧪 Automated Tests

Run the built-in end-to-end verification script:
```bash
npm test
```
This script tests:
- HTTP 200 responses for static assets and the Socket.io client script.
- Client join acknowledgment and online count tracking.
- Message broadcast delivery between multiple connected clients.
- Typing indicator events and user leave/disconnect notifications.
