const express = require('express');
const { sendContactRequest, acceptContactRequest, getContactRequests, getConfirmedContacts, declineContactRequest, getConfirmedContactsAndGroups } = require('../controllers/contactController');
const router = express.Router();

// Enviar solicitação de contato
router.post('/send', sendContactRequest);

// Aceitar solicitação de contato
router.post('/accept', acceptContactRequest);

// Rota para recusar uma solicitação de contato
router.post('/decline', declineContactRequest);

// Obter solicitações de contato
router.get('/requests', getContactRequests);

// Rota para obter contatos confirmados
router.get('/contacts', getConfirmedContacts);

// Rota para obter contatos confirmados e grupos
router.get('/', getConfirmedContactsAndGroups);

module.exports = router;