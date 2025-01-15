const express = require('express');
const Message = require('../models/Message'); // Modelo para mensagens
const { createMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

// Criar uma nova mensagem
router.post('/messages', createMessage);

// Obter mensagens para um destinatário
router.get('/messages', getMessages);

// // Criar uma nova mensagem
// router.post('/messages', async (req, res) => {
//   try {
//     const { username, message } = req.body;
//     const newMessage = new Message({ username, message });
//     await newMessage.save();
//     res.status(201).json(newMessage);
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao salvar mensagem' });
//   }
// });

// // Obter todas as mensagens
// router.get('/messages', async (req, res) => {
//   try {
//     const messages = await Message.find();
//     res.status(200).json(messages);
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao buscar mensagens' });
//   }
// });

// Atualizar uma mensagem por ID
router.put('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar mensagem' });
  }
});

// Excluir uma mensagem por ID
router.delete('/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: 'Mensagem excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir mensagem' });
  }
});

module.exports = router;
