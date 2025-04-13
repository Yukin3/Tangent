const mongoose = require('mongoose');
const { Schema } = mongoose;

const FormulaSchema = new Schema({
    name: { type: String, required: true },  // "Pythagorean Theorem"
    formula: { type: String, required: true },  // "a^2 + b^2 = c^2"
    description: { type: String },  // Explanation of formula
    relatedConcepts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concepts' }],  // Link concepts
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },  
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Formula = mongoose.model('Formulas', FormulaSchema);
  module.exports = Formula;
  