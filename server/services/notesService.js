const Note = require('../models/Notes');
const Folder = require('../models/Folders');


async function getNotes(queryParams) {
  const { noteId, title, tag, userId, publicOnly } = queryParams;

  const filter = {};

  if (noteId) {
    filter._id = noteId;
  }

  if (title) {
    filter.title = new RegExp(title, 'i'); // partial match, case-insensitive
  }

  if (tag) {
    filter.tags = tag;
  }

  if (userId) {
    filter.userId = userId;
  }

  // Later you can make this smarter to pull notes from a public admin user
  if (publicOnly) {
    filter.userId = process.env.ADMIN_USER_ID;
  }

  const notes = await Note.find(filter).sort({ updatedAt: -1 });
  return notes;
}

async function createNote({ userId, title, content, tags = [], folderId = null }) {
  // Create the note with optional folder reference
  const note = await Note.create({
    userId,
    title,
    content,
    tags,
    folder: folderId || null,
  });

  // If a folderId was provided, update that folder’s note list
  if (folderId) {
    await Folder.findByIdAndUpdate(
      folderId,
      { $addToSet: { noteIds: note._id } }, // avoid duplicates
      { new: true }
    );
  }

  return note;
}

module.exports = {
  getNotes,
  createNote,
};
