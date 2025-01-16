const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { connectDB, connectRedis } = require("./dbStrategy/database");
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // URL do frontend
    methods: ["GET", "POST"],
  },
});

// Middleware para habilitar o CORS
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB e Redis
(async () => {
  await connectDB();
  const redisClient = await connectRedis();
  app.set("redisClient", redisClient);

  // Redis Pub/Sub para sincronizar eventos entre réplicas
  const redisSubscriber = redisClient.duplicate();
  await redisSubscriber.connect();

  // Subscribing to channels
  redisSubscriber.subscribe("messages:*", (message, channel) => {
    console.log(`Mensagem recebida no canal ${channel}:`, message);

    const [_, roomId] = channel.split(":");
    io.to(roomId).emit("receive-message", JSON.parse(message));
  });

  // WebSocket logic
  io.on("connection", (socket) => {
    console.log(`Novo cliente conectado: ${socket.id}`);

    // Entrar em um grupo (sala)
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`Usuário entrou na sala: ${roomId}`);
    });

    // Enviar mensagem para uma sala
    socket.on("send-message", async (data) => {
      const { roomId, message, sender } = data;

      // Publicar a mensagem no Redis para sincronização entre réplicas
      await redisClient.publish(
        `messages:${roomId}`,
        JSON.stringify({ sender, message })
      );

      console.log(`Mensagem publicada no canal messages:${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`Cliente desconectado: ${socket.id}`);
    });
  });

  // Usar as rotas
  app.use("/api", messageRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/groups", groupRoutes);

  // Teste de endpoint
  app.get("/", (req, res) => res.send("API funcionando!"));

  // Iniciar o servidor
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
})();
