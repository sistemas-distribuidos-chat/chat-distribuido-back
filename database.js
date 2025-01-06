const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Conexão com o MongoDB
    await mongoose.connect('mongodb://localhost:27017/chat', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado ao MongoDB!');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
