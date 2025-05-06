const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  comment:  { type: String },
  fileUrl:  { type: String, required: true },
  fileType: { type: String },
  author:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  approved: { type: Boolean, default: false },
  likes:    { type: Number, default: 0 },
  quiz:     { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  private:  { type: Boolean, default: false, required: true },  
  canBePub: { type: Boolean, default: true },
  subject:  {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true }

}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
