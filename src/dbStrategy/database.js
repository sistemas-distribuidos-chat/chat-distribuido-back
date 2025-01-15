const mongoose = require('mongoose');
const { createClient } = require('redis'); // Importa Redis

const connectDB = async () => {
  try {
    // Conexão com o MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL; // Use um valor padrão se a variável não estiver definida

  const redisClient = createClient({ url: redisUrl });

  redisClient.on('error', (err) => console.error('Erro no Redis:', err));

  try {
    await redisClient.connect();
    console.log('Conectado ao Redis!');
  } catch (err) {
    console.error('Erro ao conectar ao Redis:', err);
    process.exit(1);
  }

  return redisClient;
};

module.exports = {
  connectDB,
  connectRedis,
};
