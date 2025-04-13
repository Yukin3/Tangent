const mongoose = require('mongoose');
const { Schema } = mongoose;

const ConceptSchema = new Schema({
    name: { type: String, required: true },  // Concept/theorem name
    description: { type: String },  // Detailed explanation
    examples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equations' }],  // Equations where used
    relatedConcepts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Concepts' }],  // Related concepts
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true }, 
    source: { type: String, enum: ['dataset', 'ai', 'user'], default: 'dataset' }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const Concept = mongoose.model('Concepts', ConceptSchema);
  module.exports = Concept;
  