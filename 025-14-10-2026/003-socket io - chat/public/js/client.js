// ==========================================================================
// CLIENT-SIDE REAL-TIME CHAT APPLICATION (SOCKET.IO)
// ==========================================================================

(() => {
  'use strict';

  // Connect to Socket.io server
  const socket = io();

  // App State
  let currentUser = null;
  let onlineUsers = [];
  let typingUsers = new Set();
  let typingTimeout = null;
  let soundEnabled = true;
  let unreadCount = 0;

  // DOM Elements - Views
  const viewJoin = document.getElementById('view-join');
  const viewChat = document.getElementById('view-chat');

  // DOM Elements - Join View
  const joinForm = document.getElementById('join-form');
  const usernameInput = document.getElementById('username-input');
  const charCounter = document.getElementById('char-counter');
  const joinError = document.getElementById('join-error');
  const joinBtn = document.getElementById('join-btn');
  const joinOnlineCount = document.getElementById('join-online-count');

  // DOM Elements - Chat View Header
  const chatOnlineCount = document.getElementById('chat-online-count');
  const usersToggleBtn = document.getElementById('users-toggle-btn');
  const usersDropdown = document.getElementById('users-dropdown');
  const usersList = document.getElementById('users-list');
  const dropdownCountTag = document.getElementById('dropdown-count-tag');
  const currentUserAvatar = document.getElementById('current-user-avatar');
  const currentUserName = document.getElementById('current-user-name');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIconOn = document.getElementById('sound-icon-on');
  const soundIconOff = document.getElementById('sound-icon-off');
  const leaveChatBtn = document.getElementById('leave-chat-btn');

  // DOM Elements - Chat Area
  const chatMessages = document.getElementById('chat-messages');
  const scrollBottomBtn = document.getElementById('scroll-bottom-btn');
  const unreadPill = document.getElementById('unread-pill');
  const typingIndicator = document.getElementById('typing-indicator');
  const typingText = document.getElementById('typing-text');
  const chatForm = document.getElementById('chat-form');
  const messageInput = document.getElementById('message-input');
  const quickEmojis = document.querySelectorAll('.quick-emoji');

  // ==========================================================================
  // AUDIO SYNTHESIS (Web Audio API - No external files needed)
  // ==========================================================================
  let audioCtx = null;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, duration, type = 'sine', gainVal = 0.08) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted yet
    }
  }

  function playMessageSound() {
    // Soft double chime (Marimba style)
    playTone(523.25, 0.12, 'sine', 0.08); // C5
    setTimeout(() => playTone(659.25, 0.18, 'sine', 0.06), 70); // E5
  }

  function playJoinSound() {
    // Ascending chime
    playTone(440.0, 0.1, 'triangle', 0.05); // A4
    setTimeout(() => playTone(554.37, 0.12, 'triangle', 0.05), 80); // C#5
    setTimeout(() => playTone(659.25, 0.18, 'triangle', 0.06), 160); // E5
  }

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  // Generate deterministic gradient / color from username
  function getAvatarStyle(name) {
    const palette = [
      'linear-gradient(135deg, #f43f5e, #fb7185)',
      'linear-gradient(135deg, #8b5cf6, #c084fc)',
      'linear-gradient(135deg, #06b6d4, #38bdf8)',
      'linear-gradient(135deg, #10b981, #34d399)',
      'linear-gradient(135deg, #f59e0b, #fbbf24)',
      'linear-gradient(135deg, #ec4899, #f472b6)',
      'linear-gradient(135deg, #3b82f6, #60a5fa)',
      'linear-gradient(135deg, #14b8a6, #2dd4bf)'
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % palette.length;
    return palette[index];
  }

  function formatTime(isoOrTimestamp) {
    const date = isoOrTimestamp ? new Date(isoOrTimestamp) : new Date();
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Check if messages container is scrolled to the bottom
  function isScrolledToBottom() {
    const threshold = 60;
    return (
      chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight <= threshold
    );
  }

  function scrollToBottom(smooth = true) {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto'
    });
    unreadCount = 0;
    unreadPill.classList.add('hidden');
    scrollBottomBtn.classList.add('hidden');
  }

  // Switch Active View
  function showView(viewName) {
    if (viewName === 'chat') {
      viewJoin.classList.remove('active');
      viewChat.classList.add('active');
      messageInput.focus();
    } else {
      viewChat.classList.remove('active');
      viewJoin.classList.add('active');
      usernameInput.focus();
    }
  }

  // Update Online User Count Badge
  function updateOnlineCounts(count) {
    if (joinOnlineCount) joinOnlineCount.textContent = count;
    if (chatOnlineCount) chatOnlineCount.textContent = count;
    if (dropdownCountTag) dropdownCountTag.textContent = `${count} Active`;
  }

  // Populate Users Dropdown
  function renderUsersDropdown(users) {
    usersList.innerHTML = '';
    if (!users || users.length === 0) {
      usersList.innerHTML = '<li class="users-list-item" style="color:var(--text-muted); font-size:0.8rem;">No other users</li>';
      return;
    }

    users.forEach((username) => {
      const isSelf = currentUser && username === currentUser.username;
      const li = document.createElement('li');
      li.className = 'users-list-item';

      const avatar = document.createElement('div');
      avatar.className = 'user-item-avatar';
      avatar.style.background = getAvatarStyle(username);
      avatar.textContent = username.charAt(0).toUpperCase();

      const nameSpan = document.createElement('span');
      nameSpan.className = 'user-item-name';
      nameSpan.textContent = username;

      li.appendChild(avatar);
      li.appendChild(nameSpan);

      if (isSelf) {
        const youBadge = document.createElement('span');
        youBadge.className = 'user-item-you';
        youBadge.textContent = '(You)';
        li.appendChild(youBadge);
      }

      usersList.appendChild(li);
    });
  }

  // ==========================================================================
  // UI EVENT HANDLERS
  // ==========================================================================

  // Username Input Character Counter & Error Reset
  usernameInput.addEventListener('input', () => {
    const len = usernameInput.value.length;
    charCounter.textContent = `${len}/25`;
    joinError.classList.remove('visible');
    joinError.textContent = '';
  });

  // Join Form Submission
  joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawName = usernameInput.value.trim();

    if (!rawName) {
      joinError.textContent = 'Please enter a display name to continue.';
      joinError.classList.add('visible');
      usernameInput.focus();
      return;
    }

    if (rawName.length > 25) {
      joinError.textContent = 'Name must be 25 characters or fewer.';
      joinError.classList.add('visible');
      return;
    }

    joinBtn.disabled = true;
    joinBtn.textContent = 'Connecting...';

    // Emit join event to server
    socket.emit('user:join', { username: rawName }, (response) => {
      joinBtn.disabled = false;
      joinBtn.innerHTML = `
        <span>Enter Chat Room</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      `;

      if (response && response.success) {
        currentUser = { username: response.username };

        // Update Chat Header User Info
        currentUserName.textContent = currentUser.username;
        currentUserAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        currentUserAvatar.style.background = getAvatarStyle(currentUser.username);

        // Update Online counts
        if (response.onlineCount !== undefined) {
          updateOnlineCounts(response.onlineCount);
        }
        if (response.onlineUsers) {
          onlineUsers = response.onlineUsers;
          renderUsersDropdown(onlineUsers);
        }

        // Switch to Chat View
        showView('chat');
        playJoinSound();
      } else {
        joinError.textContent = response?.error || 'Failed to join chat. Please try again.';
        joinError.classList.add('visible');
      }
    });
  });

  // Leave Chat Action
  leaveChatBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to leave the chat room?')) {
      socket.emit('user:leave');
      currentUser = null;
      showView('join');
      usernameInput.value = '';
      charCounter.textContent = '0/25';
      joinError.classList.remove('visible');
    }
  });

  // Send Message Form Submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();

    if (!text || !currentUser) return;

    // Send to server
    socket.emit('chat:message', { text });

    // Reset input
    messageInput.value = '';

    // Cancel typing indicator immediately
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    socket.emit('user:typing', false);
    messageInput.focus();
  });

  // Typing Indicator Tracker
  messageInput.addEventListener('input', () => {
    if (!currentUser) return;

    const hasText = messageInput.value.trim().length > 0;
    if (hasText) {
      socket.emit('user:typing', true);

      if (typingTimeout) clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        socket.emit('user:typing', false);
        typingTimeout = null;
      }, 1500);
    } else {
      if (typingTimeout) clearTimeout(typingTimeout);
      socket.emit('user:typing', false);
    }
  });

  // Quick Emoji Click
  quickEmojis.forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.getAttribute('data-emoji');
      messageInput.value += emoji;
      messageInput.focus();
    });
  });

  // Scroll to Bottom Button
  scrollBottomBtn.addEventListener('click', () => {
    scrollToBottom(true);
  });

  // Track chat scroll position
  chatMessages.addEventListener('scroll', () => {
    if (isScrolledToBottom()) {
      scrollBottomBtn.classList.add('hidden');
      unreadCount = 0;
      unreadPill.classList.add('hidden');
    }
  });

  // Users Dropdown Toggle
  usersToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = usersDropdown.classList.contains('hidden');
    if (isHidden) {
      usersDropdown.classList.remove('hidden');
      usersToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      usersDropdown.classList.add('hidden');
      usersToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (!usersDropdown.contains(e.target) && !usersToggleBtn.contains(e.target)) {
      usersDropdown.classList.add('hidden');
      usersToggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Sound Toggle
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      soundIconOn.classList.remove('hidden');
      soundIconOff.classList.add('hidden');
      playTone(600, 0.1, 'sine', 0.05);
    } else {
      soundIconOn.classList.add('hidden');
      soundIconOff.classList.remove('hidden');
    }
  });

  // ==========================================================================
  // DOM BUILDERS: MESSAGES & SYSTEM ALERTS
  // ==========================================================================

  function appendChatMessage(msg) {
    const isSelf = currentUser && msg.sender === currentUser.username;
    const wasAtBottom = isScrolledToBottom();

    const row = document.createElement('div');
    row.className = `message-row ${isSelf ? 'self' : 'other'}`;
    row.id = msg.id;

    const timeStr = formatTime(msg.timestamp);

    if (isSelf) {
      row.innerHTML = `
        <div class="message-bubble-wrapper">
          <div class="message-bubble">${escapeHtml(msg.text)}</div>
          <span class="message-time">${timeStr}</span>
        </div>
      `;
    } else {
      const avatarStyle = getAvatarStyle(msg.sender);
      const initial = msg.sender.charAt(0).toUpperCase();

      row.innerHTML = `
        <div class="message-avatar" style="background:${avatarStyle}">${initial}</div>
        <div class="message-bubble-wrapper">
          <span class="message-sender-name">${escapeHtml(msg.sender)}</span>
          <div class="message-bubble">${escapeHtml(msg.text)}</div>
          <span class="message-time">${timeStr}</span>
        </div>
      `;
    }

    chatMessages.appendChild(row);

    if (isSelf || wasAtBottom) {
      scrollToBottom(true);
    } else {
      unreadCount++;
      unreadPill.textContent = `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`;
      unreadPill.classList.remove('hidden');
      scrollBottomBtn.classList.remove('hidden');
    }

    // Play chime for incoming messages from others
    if (!isSelf) {
      playMessageSound();
    }
  }

  function appendSystemNotification(text, icon = 'ℹ️') {
    const wasAtBottom = isScrolledToBottom();

    const wrapper = document.createElement('div');
    wrapper.className = 'message-system';
    wrapper.innerHTML = `
      <div class="system-pill">
        <span>${icon}</span>
        <span>${escapeHtml(text)}</span>
      </div>
    `;

    chatMessages.appendChild(wrapper);

    if (wasAtBottom) {
      scrollToBottom(true);
    }
  }

  function updateTypingDisplay() {
    if (typingUsers.size === 0) {
      typingIndicator.classList.add('hidden');
    } else {
      const names = Array.from(typingUsers);
      let text = '';
      if (names.length === 1) {
        text = `${names[0]} is typing...`;
      } else if (names.length === 2) {
        text = `${names[0]} and ${names[1]} are typing...`;
      } else {
        text = 'Multiple people are typing...';
      }
      typingText.textContent = text;
      typingIndicator.classList.remove('hidden');
    }
  }

  // ==========================================================================
  // SOCKET.IO EVENT LISTENERS
  // ==========================================================================

  // Count update for guest / connecting users
  socket.on('users:count', (data) => {
    if (data && data.onlineCount !== undefined) {
      updateOnlineCounts(data.onlineCount);
    }
  });

  // Updated full user list and count
  socket.on('users:update', (data) => {
    if (data && data.onlineCount !== undefined) {
      updateOnlineCounts(data.onlineCount);
    }
    if (data && data.onlineUsers) {
      onlineUsers = data.onlineUsers;
      renderUsersDropdown(onlineUsers);
    }
  });

  // User joined notification
  socket.on('user:joined', (data) => {
    if (data && data.username) {
      appendSystemNotification(`${data.username} joined the chat`, '👋');
    }
  });

  // User left notification
  socket.on('user:left', (data) => {
    if (data && data.username) {
      appendSystemNotification(`${data.username} left the chat`, '🚪');
      // Remove from typing if was typing
      typingUsers.delete(data.username);
      updateTypingDisplay();
    }
  });

  // Incoming chat message
  socket.on('chat:message', (msg) => {
    appendChatMessage(msg);
  });

  // Typing status update
  socket.on('user:typing', (data) => {
    if (!data || !data.username) return;
    if (data.isTyping) {
      typingUsers.add(data.username);
    } else {
      typingUsers.delete(data.username);
    }
    updateTypingDisplay();
  });

  // Reconnection & connection state handling
  socket.on('disconnect', () => {
    appendSystemNotification('Disconnected from server. Attempting to reconnect...', '⚠️');
  });

  socket.on('connect', () => {
    if (currentUser) {
      // Re-register if reconnected
      socket.emit('user:join', { username: currentUser.username });
    }
  });
})();
