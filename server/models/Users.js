const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  preferences: {
    theme: { type: String, default: 'light' },
    aiModel: { type: String, default: 'gpt-3.5' },
    fontSize: { type: String, default: 'medium' },
    showGraphOnStartup: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model('Users', UserSchema);
module.exports = User;
