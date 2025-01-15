const Message = require('../models/Message');

// Criar uma nova mensagem
const createMessage = async (req, res) => {
  try {
    const { sender, recipient, isGroup, message } = req.body;

    if (isGroup) {
      const group = await Group.findById(recipient);
      if (!group) {
        return res.status(404).json({ error: 'Grupo não encontrado' });
      }
    }

    const newMessage = new Message({
      sender,
      recipient,
      isGroup,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao salvar mensagem' });
  }
};

// Obter mensagens para um usuário ou grupo
const getMessages = async (req, res) => {
  try {
    const { recipient, isGroup } = req.query;

    const messages = await Message.find({ recipient, isGroup })
      .populate('sender', 'name email') // Inclui informações do remetente
      .sort({ timestamp: -1 });

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

// Atualizar uma mensagem por ID
const updateMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar mensagem' });
  }
};

// Excluir uma mensagem por ID
const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: 'Mensagem excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir mensagem' });
  }
};

module.exports = {
  createMessage,
  getMessages,
  updateMessageById,
  deleteMessageById,
};
