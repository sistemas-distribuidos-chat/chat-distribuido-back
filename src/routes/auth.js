const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const router = express.Router();

// Rota de Cadastro
router.post(
  '/register',
  [
    body('email', 'E-mail inválido').isEmail(),
    body('password', 'A senha deve ter no mínimo 6 caracteres').isLength({ min: 6 }),
  ],
  authController.register
);

// Rota de Login
router.post(
  '/login',
  [
    body('email', 'E-mail inválido').isEmail(),
    body('password', 'Senha é obrigatória').exists(),
  ],
  authController.login
);

module.exports = router;
