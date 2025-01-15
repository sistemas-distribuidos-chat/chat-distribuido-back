const Group = require("../models/Group");
const User = require("../models/User");

// Criar um novo grupo
const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    const group = new Group({ name, members });
    await group.save();

    res.status(201).json(group);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao criar grupo" });
  }
};

// Adicionar membros a um grupo existente
const addMembersToGroup = async (req, res) => {
  try {
    const { groupId } = req.params; // ID do grupo na URL
    const { members } = req.body; // IDs dos novos membros no corpo da requisição

    // Verificar se o grupo existe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Grupo não encontrado' });
    }

    // Verificar se os membros enviados existem no banco de dados
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({ error: 'Alguns IDs de usuários são inválidos' });
    }

    // Adicionar membros ao grupo sem duplicar
    members.forEach((memberId) => {
      if (!group.members.includes(memberId)) {
        group.members.push(memberId);
      }
    });

    // Salvar as alterações no grupo
    await group.save();

    res.status(200).json({ message: 'Membros adicionados com sucesso', group });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao adicionar membros ao grupo' });
  }
};

// Obter todos os grupos de um usuário
const getGroups = async (req, res) => {
  try {
    const { userId } = req.query; // Verifica se um userId foi enviado

    if (!userId) {
      return res.status(400).json({ error: "O parâmetro userId é necessário" });
    }

    const groups = await Group.find({ members: userId }).populate(
      "members",
      "name email"
    );
    res.status(200).json(groups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar grupos" });
  }
};
module.exports = {
  createGroup,
  getGroups,
  addMembersToGroup,
};
