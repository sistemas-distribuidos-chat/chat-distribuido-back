const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); // Modelo do usuário
const router = express.Router();

const JWT_SECRET = "seu_secret_key_aqui"; // Coloque uma chave secreta forte

// Rota de Cadastro
router.post(
  '/register',
  [
    body('email', 'E-mail inválido').isEmail(),
    body('password', 'A senha deve ter no mínimo 6 caracteres').isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword });

      await newUser.save();
      res.status(201).json({ message: 'Usuário registrado com sucesso!' });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao registrar o usuário' });
    }
  }
);

// Rota de Login
router.post(
  '/login',
  [
    body('email', 'E-mail inválido').isEmail(),
    body('password', 'Senha é obrigatória').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(400).json({ error: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, name: user.name });
    } catch (err) {
      res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }
);

module.exports = router;
