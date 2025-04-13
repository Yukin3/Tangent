const mongoose = require('mongoose');
const { Schema } = mongoose;

const EquationSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notes', required: true },
  expression: { type: String, required: true },  // The equation or inequality as a string
  solution: { type: String },  // AI-generated solution or result
  formulaUsed: { type: mongoose.Schema.Types.ObjectId, ref: 'Formulas' },  // Reference to a Formula document
  inequalities: { type: Boolean, default: false },  // Whether the equation is an inequality
  concepts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concepts' }],  // Concepts related to this equation (e.g., "Pythagorean Theorem")
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true },  // Equation subject category
  activeMemory: { type: Boolean, default: true },  // Whether this equation is part of active memory for suggestions
  tags: [String],  // Tags for easy categorization (e.g., "algebra", "calculus")
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Equation = mongoose.model('Equations', EquationSchema);
module.exports = Equation;
