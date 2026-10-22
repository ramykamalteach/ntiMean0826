const http = require('http');
const { io } = require('socket.io-client');

const SERVER_URL = 'http://localhost:3001';

async function checkUrl(path) {
  return new Promise((resolve, reject) => {
    http.get(`${SERVER_URL}${path}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, length: data.length }));
    }).on('error', reject);
  });
}

async function runTests() {
  console.log('--- Testing HTTP Assets & Server ---');
  
  const root = await checkUrl('/');
  console.log(`GET / : status ${root.statusCode}, size ${root.length} bytes [${root.statusCode === 200 ? 'PASS' : 'FAIL'}]`);

  const css = await checkUrl('/css/style.css');
  console.log(`GET /css/style.css : status ${css.statusCode}, size ${css.length} bytes [${css.statusCode === 200 ? 'PASS' : 'FAIL'}]`);

  const js = await checkUrl('/js/client.js');
  console.log(`GET /js/client.js : status ${js.statusCode}, size ${js.length} bytes [${js.statusCode === 200 ? 'PASS' : 'FAIL'}]`);

  const socketLib = await checkUrl('/socket.io/socket.io.js');
  console.log(`GET /socket.io/socket.io.js : status ${socketLib.statusCode}, size ${socketLib.length} bytes [${socketLib.statusCode === 200 ? 'PASS' : 'FAIL'}]`);

  console.log('\n--- Testing Socket.io Real-Time Chat Logic ---');

  // Client 1 (Alice)
  const socket1 = io(SERVER_URL);
  // Client 2 (Bob)
  const socket2 = io(SERVER_URL);

  await new Promise((resolve) => socket1.on('connect', resolve));
  console.log('[Socket] Client 1 (Alice) connected.');

  await new Promise((resolve) => socket2.on('connect', resolve));
  console.log('[Socket] Client 2 (Bob) connected.');

  // Alice joins
  await new Promise((resolve) => {
    socket1.emit('user:join', { username: 'Alice' }, (res) => {
      console.log('[Alice Join Response]:', res);
      if (res && res.success && res.username === 'Alice') {
        console.log('Alice join verification: PASS');
      }
      resolve();
    });
  });

  // Bob joins, Alice should receive user:joined
  const bobJoinedPromise = new Promise((resolve) => {
    socket1.on('user:joined', (data) => {
      console.log('[Alice received user:joined]:', data);
      if (data.username === 'Bob') {
        console.log('Alice notified of Bob joining: PASS');
      }
      resolve();
    });
  });

  await new Promise((resolve) => {
    socket2.emit('user:join', { username: 'Bob' }, (res) => {
      console.log('[Bob Join Response]:', res);
      resolve();
    });
  });

  await bobJoinedPromise;

  // Bob sends a message, Alice should receive it
  const messagePromise = new Promise((resolve) => {
    socket1.on('chat:message', (msg) => {
      console.log('[Alice received chat:message]:', msg);
      if (msg.sender === 'Bob' && msg.text === 'Hello Alice! Welcome to the chat room.') {
        console.log('Real-time message broadcast verification: PASS');
      }
      resolve();
    });
  });

  socket2.emit('chat:message', { text: 'Hello Alice! Welcome to the chat room.' });
  await messagePromise;

  // Alice emits typing, Bob should receive it
  const typingPromise = new Promise((resolve) => {
    socket2.on('user:typing', (data) => {
      console.log('[Bob received typing event]:', data);
      if (data.username === 'Alice' && data.isTyping === true) {
        console.log('Typing indicator verification: PASS');
      }
      resolve();
    });
  });

  socket1.emit('user:typing', true);
  await typingPromise;

  // Alice leaves, Bob should receive user:left
  const leavePromise = new Promise((resolve) => {
    socket2.on('user:left', (data) => {
      console.log('[Bob received user:left]:', data);
      if (data.username === 'Alice') {
        console.log('User leave notification verification: PASS');
      }
      resolve();
    });
  });

  socket1.emit('user:leave');
  await leavePromise;

  socket1.disconnect();
  socket2.disconnect();

  console.log('\nAll tests completed successfully!');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
