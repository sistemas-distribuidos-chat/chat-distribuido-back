const express = require("express");
const cors = require("cors");
require('dotenv').config();
const { connectDB, connectRedis } = require("./dbStrategy/database"); // Importa conexões
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");

const app = express();

// Middleware para habilitar o CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Conectar ao MongoDB e Redis
(async () => {
  try {
    await connectDB(); // Conecta ao MongoDB
    const redisClient = await connectRedis(); // Conecta ao Redis

    // Armazene o Redis Client no app para uso em outras partes do sistema
    app.set('redisClient', redisClient);

    // Configura rotas
    app.use("/api", messageRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/groups", groupRoutes);

    // Inicia o servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  } catch (err) {
    console.error('Erro ao inicializar o servidor:', err);
  }
})();
