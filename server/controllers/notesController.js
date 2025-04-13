const noteService = require('../services/notesService');

async function fetchNotes(req, res) {
  try {
    const notes = await noteService.getNotes(req.query);
    res.json({ success: true, data: notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: `Failed to fetch notes: ${err.message }` });
  }
}

async function createNote(req, res) {
    try {
      const noteData = req.body;
  
      // Optional: validate required fields manually or with a validation lib
      if (!noteData.userId || !noteData.title || !noteData.content) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
  
      const createdNote = await noteService.createNote(noteData);
      res.status(201).json({ success: true, data: createdNote });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Failed to create note' });
    }
}
  

module.exports = {
  fetchNotes,
  createNote,
};
