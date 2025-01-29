const User = require("../models/User");

// Enviar solicitação de contato
const sendContactRequest = async (req, res) => {
  try {
    const { userId } = req.body; // Usuário logado
    const { target } = req.body; // Username ou email do destinatário

    // Buscar o usuário alvo pelo username ou email
    const targetUser = await User.findOne({
      $or: [{ email: target }, { name: target }],
    });

    if (!targetUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (targetUser.contactRequests.includes(userId)) {
      return res
        .status(400)
        .json({ error: "Você já enviou uma solicitação para este usuário" });
    }

    // Adicionar o ID do usuário logado às solicitações pendentes do destinatário
    targetUser.contactRequests.push(userId);
    await targetUser.save();

    res
      .status(200)
      .json({ message: "Solicitação de contato enviada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao enviar solicitação de contato" });
  }
};

// Aceitar solicitação de contato
const acceptContactRequest = async (req, res) => {
  try {
    const { userId } = req.body; // Usuário logado
    const { requesterId } = req.body; // ID do usuário que enviou a solicitação

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Verificar se a solicitação existe
    if (!user.contactRequests.includes(requesterId)) {
      return res.status(400).json({ error: "Solicitação não encontrada" });
    }

    // Remover a solicitação pendente e adicionar aos contatos de ambos
    user.contactRequests = user.contactRequests.filter(
      (id) => id.toString() !== requesterId
    );
    user.contacts.push(requesterId);
    requester.contacts.push(userId);

    await user.save();
    await requester.save();

    res
      .status(200)
      .json({ message: "Solicitação de contato aceita com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao aceitar solicitação de contato" });
  }
};

// Obter solicitações de contato feitas para o usuário
const getContactRequests = async (req, res) => {
  try {
    const { userId } = req.query; // ID do usuário logado

    if (!userId) {
      return res
        .status(400)
        .json({ error: "O parâmetro userId é obrigatório" });
    }

    // Buscar o usuário logado e suas solicitações pendentes
    const user = await User.findById(userId).populate(
      "contactRequests",
      "name email"
    );

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Retornar as solicitações de contato
    res.status(200).json({ contactRequests: user.contactRequests });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar solicitações de contato" });
  }
};

// Obter contatos confirmados de um usuário
const getConfirmedContacts = async (req, res) => {
    try {
      const { userId } = req.query; // ID do usuário logado
  
      if (!userId) {
        return res.status(400).json({ error: 'O parâmetro userId é obrigatório' });
      }
  
      // Buscar o usuário logado e os contatos confirmados
      const user = await User.findById(userId).populate('contacts', 'name email');
  
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Retornar os contatos confirmados
      res.status(200).json({ contacts: user.contacts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar contatos' });
    }
  };

  // Recusar uma solicitação de contato
const declineContactRequest = async (req, res) => {
  try {
    const { userId, requesterId } = req.body; // ID do usuário logado e ID do solicitante

    if (!userId || !requesterId) {
      return res.status(400).json({ error: 'Os parâmetros userId e requesterId são obrigatórios' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Verificar se a solicitação existe
    if (!user.contactRequests.includes(requesterId)) {
      return res.status(400).json({ error: 'Solicitação de contato não encontrada' });
    }

    // Remover a solicitação de contato da lista
    user.contactRequests = user.contactRequests.filter((id) => id.toString() !== requesterId);
    await user.save();

    res.status(200).json({ message: 'Solicitação de contato recusada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao recusar solicitação de contato' });
  }
};


module.exports = {
  sendContactRequest,
  acceptContactRequest,
  getContactRequests,
  getConfirmedContacts,
  declineContactRequest
};
