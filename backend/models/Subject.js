const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name:    { type: String, required: true, unique: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
