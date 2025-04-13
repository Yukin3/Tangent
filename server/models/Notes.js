const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  backlinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Links'}], //Track links
  folder: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders', default: null }, 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Note = mongoose.model('Notes', NoteSchema);
module.exports = Note;
