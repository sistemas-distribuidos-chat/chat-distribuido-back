const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User'); // Modelo do usuário
const Session = require('../models/Session');
const redisClient = require('../dbStrategy/redisClient');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
}

// Função para registrar um usuário
const register = async (req, res) => {
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
    if(err.code === 11000) {
      return res.status(422).json({ error: 'E-mail já cadastrado' });
    }
    res.status(500).json({ error: 'Erro interno ao registrar o usuário' });
  }
};

// Função para login
const login = async (req, res) => {
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

    // Gerar token JWT
    const token = jwt.sign({ id: user._id, email: user.email, username: user.name }, JWT_SECRET, { expiresIn: '1h' });

    // Salvar a sessão no Redis
    await redisClient.set(`session:${user._id}`, JSON.stringify({ token, loginTime: Date.now() }), {
      EX: 3600, // Define um tempo de expiração de 1 hora
    });

    res.status(200).json({ token, name: user.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
};


module.exports = {
  register,
  login,
};
