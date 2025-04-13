const mongoose = require('mongoose');
const { Schema } = mongoose;

const FolderSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  name: {type: String,required: true,
validate: {
      validator: function(value) {
        return value.length >= 3 && value.length <= 100; // Validate name 
      },
      message: "Folder name must be between 3 and 100 characters",
    }
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Folders', default: null, }, // Null if top-level
  noteIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notes' }],
  path: { type: [String], required: true },  // ["root", "work", "projects"]
  isStarred: {  type: Boolean, default: false },  
}, { timestamps: true });

FolderSchema.index({ userId: 1, parent: 1, name: 1 }, { unique: true });  // Unique names per parent

const Folder = mongoose.model('Folders', FolderSchema);
module.exports = Folder;
