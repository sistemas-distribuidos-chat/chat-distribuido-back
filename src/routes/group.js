const express = require('express');
const { createGroup, getGroups, addMembersToGroup } = require('../controllers/groupController');
const router = express.Router();

// Criar um novo grupo
router.post('/create', createGroup);

// Obter grupos de um usuário
router.get('/', getGroups);

// Adicionar membros a um grupo
router.put('/:groupId/members', addMembersToGroup);

module.exports = router;
