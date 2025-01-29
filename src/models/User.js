const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Contatos confirmados
  contactRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Solicitações pendentes
});

module.exports = mongoose.model('User', UserSchema);
