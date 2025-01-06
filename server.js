const express = require('express');
const connectDB = require('./database');
const messageRoutes = require('./routes/messages');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Conectar ao MongoDB
connectDB();

// Usar as rotas de mensagens
app.use('/api', messageRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
