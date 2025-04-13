const mongoose = require('mongoose');
const { Schema } = mongoose;

const LinkSchema = new Schema({
  sourceNoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes', required: true },
  targetNoteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  type: { type: String, required: true },  //"related", "reference", etc.
  createdAt: { type: Date, default: Date.now }
});

const Link = mongoose.model('Links', LinkSchema);
module.exports = Link;
