const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notesController');

router.get('/', notesController.fetchNotes); // GET /api/notes?userId=...&tag=...&title=...
router.post('/', notesController.createNote); // POST /api/notes


module.exports = router;
