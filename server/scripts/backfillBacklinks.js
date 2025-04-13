const mongoose = require('mongoose');
require('dotenv').config();

const Note = require('../models/Notes');
const Link = require('../models/Links');

async function backfillBacklinks() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const allLinks = await Link.find({});
    console.log(`Found ${allLinks.length} links`);

    for (const link of allLinks) {
      await Note.updateOne(
        { _id: link.targetNoteId },
        { $addToSet: { backlinks: link._id } }
      );
    }

    console.log("Backlink population complete");
    process.exit(0);
  } catch (err) {
    console.error("Error during backlink backfill:", err);
    process.exit(1);
  }
}

backfillBacklinks();
