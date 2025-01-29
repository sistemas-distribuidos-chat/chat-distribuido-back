const redisClient = require('../dbStrategy/redisClient');
const Group = require('../models/Group');
const Message = require('../models/Message');

// // Criar uma nova mensagem
// const createMessage = async (req, res) => {
//   try {
//     const { sender, recipient, isGroup, message } = req.body;

//     if (isGroup) {
//       const group = await Group.findById(recipient);
//       if (!group) {
//         return res.status(404).json({ error: 'Grupo não encontrado' });
//       }
//     }

//     const newMessage = new Message({
//       sender,
//       recipient,
//       isGroup,
//       message,
//     });

//     await newMessage.save();

//     // Publique a mensagem no canal Redis
//     await redisClient.publish(`messages:${recipient}`, JSON.stringify(newMessage));

//     res.status(201).json(newMessage);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Erro ao salvar mensagem' });
//   }
// };

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

// Obter contatos de um usuário com base nas mensagens enviadas/recebidas
const getContacts = async (req, res) => {
  try {
    const { userId } = req.query; // ID do usuário logado
    if (!userId) {
      return res.status(400).json({ error: 'O parâmetro userId é obrigatório' });
    }

    // Buscar mensagens enviadas ou recebidas pelo usuário
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).populate('sender', 'name email').populate('recipient', 'name email');

    // Extrair os IDs dos contatos únicos
    const contacts = new Set();
    messages.forEach((msg) => {
      if (msg.sender._id.toString() !== userId) {
        contacts.add(msg.sender);
      }
      if (msg.recipient.toString() !== userId) {
        contacts.add(msg.recipient);
      }
    });

    res.status(200).json(Array.from(contacts)); // Retorna os contatos como uma lista
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar contatos' });
  }
};

// Listar mensagens entre o usuário e um contato específico
const getMessagesWithContact = async (req, res) => {
  try {
    const { userId, contactId } = req.query; // IDs do usuário logado e do contato

    if (!userId || !contactId) {
      return res.status(400).json({ error: 'Os parâmetros userId e contactId são obrigatórios' });
    }

    // Buscar mensagens trocadas entre o usuário e o contato
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: contactId },
        { sender: contactId, recipient: userId },
      ],
    })
      .sort({ timestamp: 1 }) // Ordenar por data (do mais antigo ao mais recente)
      .populate('sender', 'name email') // Popula os dados do remetente
      .populate('recipient', 'name email'); // Popula os dados do destinatário

    res.status(200).json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

// Obter todas as mensagens de um grupo específico
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.query;

    if (!groupId) {
      return res.status(400).json({ error: 'O parâmetro groupId é obrigatório' });
    }

    // Buscar mensagens do grupo ordenadas por data (mais recentes primeiro)
    const messages = await Message.find({ recipient: groupId, isGroup: true })
      .populate('sender', 'name email')
      .sort({ timestamp: -1 });

    res.status(200).json({messages});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar mensagens do grupo' });
  }
};


module.exports = {
  createMessage,
  getMessages,
  updateMessageById,
  deleteMessageById,
  getContacts,
  getMessagesWithContact,
  getGroupMessages
};
