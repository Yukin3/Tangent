const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Category = require('../models/Categories');
const Concept = require('../models/Concepts');
const Formula = require('../models/Formulas');

async function importNamedFormulas() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Load dataset
    const filePath = path.join(__dirname, '..', 'datasets', 'named-math.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const dataset = JSON.parse(raw);
    const entries = Array.isArray(dataset) ? dataset : dataset.root;
    if (!Array.isArray(entries)) {
      throw new Error("Parsed dataset is not an array. Check if it's wrapped in a 'root' key.");
    }
    
    // Get category
    const mathCategory = await Category.findOne({ name: 'Mathematics' });
    if (!mathCategory) throw new Error(`${mathCategory} category not found`);

    let createdConcepts = 0;
    let createdFormulas = 0;

    console.log(`Loaded entries:`, Array.isArray(entries) ? entries.length : 'Invalid');
    for (const entry of entries) {
      const conceptName = entry.id;
      let description = null;
      if (typeof entry.text === 'string') { //validate format
        description = entry.text;
      } else if (Array.isArray(entry.text)) {
        description = entry.text.join(' ');
      }
      

      if (typeof description !== 'string') {
        console.warn(`⚠️Unexpected description format for: ${entry.id}`);
      }

    
      // Create concept if !exists
      let concept = await Concept.findOne({ name: conceptName, category: mathCategory._id });
      if (!concept) {
        concept = await Concept.create({
          name: conceptName,
          description,
          category: mathCategory._id,
          source: 'dataset',
          examples: [],
          relatedConcepts: [],
        });
        createdConcepts++;
        console.log(`Concept created: ${conceptName}`);
      } else {
        console.log(`⚠️Concept exists: ${conceptName}`);
      }

      const formulaIds = [];

      // Loop through each version
      if (Array.isArray(entry.versions)) {
        for (const version of entry.versions) {
          let formulaStr = '';

          if (typeof version === 'string') {
            formulaStr = version;
          } else if (typeof version === 'object' && version.formula) {
            formulaStr = version.formula;
          }

          if (!formulaStr || formulaStr.trim() === '') continue;

          // Avoid exact duplicates
          const existingFormula = await Formula.findOne({
            formula: formulaStr,
            name: concept.name,
            category: mathCategory._id,
          });
          if (existingFormula) {
            console.log(`⚠️ Formula exists: ${formulaStr.substring(0, 30)}...`);
            formulaIds.push(existingFormula._id);
            continue;
          }

          const formula = await Formula.create({
            name: concept.name,
            formula: formulaStr,
            description: null,
            category: mathCategory._id,
            relatedConcepts: [concept._id],
          });

          formulaIds.push(formula._id);
          createdFormulas++;
          console.log(`Formula created: ${formulaStr.substring(0, 40)}...`);
        }
      }

      // Update concept examples
      if (formulaIds.length > 0) {
        concept.examples = formulaIds;
        await concept.save();
      }
    }

    console.log(`✅ Import complete: ${createdConcepts} concepts, ${createdFormulas} formulas`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error importing formulas:', err);
    process.exit(1);
  }
}

importNamedFormulas();
