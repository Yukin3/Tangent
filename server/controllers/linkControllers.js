const { createLinkService, getAllLinksService, getLinksForNoteService, deleteLinkService,} = require('../services/linkServices');

async function createLink(req, res) {
  try {
    const { userId, sourceNoteId, targetNoteId, type } = req.body;
    if (!userId || !sourceNoteId || !targetNoteId || !type) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const link = await createLinkService({ userId, sourceNoteId, targetNoteId, type });
    res.status(201).json({ success: true, data: link });
  } catch (err) {
    console.error('Link creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}


async function getAllLinks(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });

    const links = await getAllLinksService({ userId });
    res.status(200).json({ success: true, data: links });
  } catch (err) {
    console.error('❌ Get all links error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function getLinksForNote(req, res) {
  try {
    const { noteId } = req.query;
    if (!noteId) return res.status(400).json({ success: false, message: 'Missing noteId' });

    const links = await getLinksForNoteService({ noteId });
    res.status(200).json({ success: true, data: links });
  } catch (err) {
    console.error('❌ Get note links error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteLink(req, res) {
  try {
    const { userId, sourceNoteId, targetNoteId } = req.body;
    if (!userId || !sourceNoteId || !targetNoteId) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    const deleted = await deleteLinkService({ userId, sourceNoteId, targetNoteId });
    if (!deleted) return res.status(404).json({ success: false, message: 'Link not found' });

    res.status(200).json({ success: true, message: 'Link deleted', data: deleted });
  } catch (err) {
    console.error('❌ Delete link error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}


module.exports = { createLink, getAllLinks, getLinksForNote, deleteLink, };
