const { Server } = require('socket.io');
const { createClient } = require('redis');

const PORT = 3002;
const REDIS_URL = 'redis://:swen2026secure_redis@100.111.6.13:6379';

async function main() {
  // Redis clients for pub/sub
  const pubClient = createClient({ url: REDIS_URL });
  const subClient = pubClient.duplicate();
  
  await pubClient.connect();
  await subClient.connect();
  
  console.log('Redis connected');

  // Socket.io server
  const io = new Server(PORT, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  // Subscribe to feed updates
  await subClient.subscribe('feed-updates', (message) => {
    const data = JSON.parse(message);
    io.emit('feed-update', data);
    console.log(`Feed: ${data.user} fed ${data.species} ${data.food}`);
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    socket.on('feed', async (data) => {
      // Broadcast to all clients
      io.emit('feed-update', data);
      
      // Update leaderboard
      const leaderboard = await pubClient.zRangeWithScores('leaderboard:feeds', 0, 9, { REV: true });
      io.emit('leaderboard-update', leaderboard.map((item, i) => ({
        rank: i + 1, name: item.value, score: item.score
      })));
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  console.log(`Socket.io server running on port ${PORT}`);
}

main().catch(console.error);
