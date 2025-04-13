const mongoose = require('mongoose');
const { Schema } = mongoose;

const TagSchema = new Schema({
  name: {type: String, required: true, unique: true, lowercase: true, },
  userId: {   type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true  },
  noteIds: [{  type: mongoose.Schema.Types.ObjectId, ref: 'Notes', required: true }], 
  count: { type: Number, default: 0, required: true },
//   description: { type: String, default: '',  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto update count of notes w tag
TagSchema.pre('save', async function(next) {
  this.count = this.noteIds.length; 
  next();
});

// + or -  count
TagSchema.methods.updateCount = async function() {
  this.count = this.noteIds.length;
  await this.save();
};

const Tag = mongoose.model('Tags', TagSchema);
module.exports = Tag;
