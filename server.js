const express = require("express");
const cors = require("cors"); // Importa o CORS
const connectDB = require("./database");
const messageRoutes = require("./routes/messages");
const authRoutes = require("./routes/auth");

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
