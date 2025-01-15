const mongoose = require('mongoose');

// Esquema para mensagens
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Quem enviou
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true }, // Pode ser um usuário ou um grupo
  isGroup: { type: Boolean, default: false }, // Define se é uma mensagem para um grupo
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', MessageSchema);
