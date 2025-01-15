const express = require("express");
const cors = require("cors"); // Importa o CORS
require('dotenv').config();
const connectDB = require("./dbStrategy/database"); // Importa a função de conexão com o MongoDB
const messageRoutes = require("./routes/messages"); // Importa as rotas de mensagens 
const authRoutes = require("./routes/auth");
const groupRoutes = require("./routes/group");

const app = express();

// Middleware para habilitar o CORS
app.use(
  cors({
    origin: "http://localhost:5173", // URL do frontend
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Cabeçalhos permitidos
  })
);

// Middleware para parsear JSON
app.use(express.json());

// Conectar ao MongoDB
connectDB();

// Usar as rotas de mensagens
app.use("/api", messageRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/groups', groupRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
