const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Erro no Redis:', err));
redisClient.on('connect', () => console.log('Conectado ao Redis!'));

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
