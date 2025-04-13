const mongoose = require('mongoose');
require('dotenv').config();

const Category = require('../models/Categories');

// Top-level 
const topLevelCategories = [
  { name: "Mathematics", description: "General mathematical concepts" },
  { name: "Computer Science", description: "Theoretical foundations of computation" },
  { name: "Chemistry", description: "Study of matter and its interactions" },
  { name: "Business", description: "Study of commerce, finance, and management" },
  { name: "Geophysics", description: "Physics of Earth and planetary bodies" },
];

// Subcategories w parent
const subCategories = [
  { name: "Algebra", description: "Mathematical symbols and rules", parent: "Mathematics" },
  { name: "Geometry", description: "Properties of shapes and space", parent: "Mathematics" },
  { name: "Calculus", description: "Limits, derivatives, integrals", parent: "Mathematics" },
  { name: "Trigonometry", description: "Angles and triangle relationships", parent: "Mathematics" },
  { name: "Linear Algebra", description: "Vector spaces and matrices", parent: "Mathematics" },
  { name: "Discrete Math", description: "Mathematics of chance", parent: "Mathematics" },
  { name: "Statistics", description: "Data collection and analysis", parent: "Mathematics" },
  { name: "Number Theory", description: "Properties of integers", parent: "Mathematics" },
  { name: "Accounting", description: "Recording and analyzing financial data", parent: "Business" },
  { name: "Finance", description: "Recording and analyzing financial data", parent: "Business" },
  { name: "Machine Learning", description: "Recording and analyzing financial data", parent: "Computer Science" },
  { name: "Operating Systems", description: "Recording and analyzing financial data", parent: "Computer Science" },
  { name: "Stoichiometry", description: "Recording and analyzing financial data", parent: "Chemistry" },
  { name: "Meterology", description: "Recording and analyzing financial data", parent: "Geophysics" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const categoryMap = {};

    // Insert top-level categories
    for (const cat of topLevelCategories) {
      const existing = await Category.findOne({ name: cat.name });
      if (!existing) {
        const newCat = await Category.create(cat);
        console.log(`➕ Inserted top-level: ${cat.name}`);
        categoryMap[cat.name] = newCat._id;
      } else {
        console.log(`⚠️ Skipped (exists): ${cat.name}`);
        categoryMap[cat.name] = existing._id;
      }
    }

    // Insert subcategories 
    for (const sub of subCategories) {
      const existing = await Category.findOne({ name: sub.name });
      const parentId = categoryMap[sub.parent];

      if (!parentId) {
        console.warn(`⚠️Parent not found for ${sub.name}, skipping`);
        continue;
      }

      if (!existing) {
        await Category.create({
          name: sub.name,
          description: sub.description,
          parentCategory: parentId,
        });
        console.log(`Inserted subcategory: ${sub.name} (→ ${sub.parent})`);
      } else {
        console.log(`⚠️Skipped (exists): ${sub.name}`);
      }
    }

    console.log('✅ Category seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('❌Error seeding categories:', err);
    process.exit(1);
  }
}

seed();
