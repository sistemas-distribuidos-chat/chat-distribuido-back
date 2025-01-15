const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // IDs dos membros do grupo
});

module.exports = mongoose.model('Group', GroupSchema);
