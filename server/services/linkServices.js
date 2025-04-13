const Link = require('../models/Links');
const Note = require('../models/Notes');


async function createLinkService({ userId, sourceNoteId, targetNoteId, type }) {
  const existing = await Link.findOne({ userId, sourceNoteId, targetNoteId });
  if (existing) return existing;

  const link = await Link.create({ userId, sourceNoteId, targetNoteId, type });

  //Add link both source + target notes backlinks array
  await Promise.all([
    Note.updateOne(
      { _id: targetNoteId },
      { $addToSet: { backlinks: link._id }, $set: { updatedAt: new Date() } }
    ),
    Note.updateOne(
      { _id: sourceNoteId },
      { $set: { updatedAt: new Date() } }
    )
  ]);

  return link;
}

async function getAllLinksService({ userId }) {
  return await Link.find({ userId });
}

async function getLinksForNoteService({ noteId }) {
  return await Link.find({
    $or: [{ sourceNoteId: noteId }, { targetNoteId: noteId }]
  });
}

async function deleteLinkService({ userId, sourceNoteId, targetNoteId }) {
  return await Link.findOneAndDelete({ userId, sourceNoteId, targetNoteId });
}


module.exports = {
  createLinkService,
  getAllLinksService,
  getLinksForNoteService,
  deleteLinkService,
};
