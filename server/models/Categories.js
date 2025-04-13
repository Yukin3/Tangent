const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },  // Name (Algebra, Machine Learning)
  description: { type: String },  
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories' },  // Parent category (Math, Computer Science)
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Category = mongoose.model('Categories', CategorySchema);
module.exports = Category;
