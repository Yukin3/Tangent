const express = require('express');
const router = express.Router();
const { createLink, getAllLinks, getLinksForNote, deleteLink, } = require('../controllers/linkControllers');

router.post('/', createLink);
router.get('/', getAllLinks);         //GET ?userId=...
router.get('/note', getLinksForNote); //GET ?noteId=...
router.delete('/', deleteLink);       //Prarams: {userId, sourceNoteId, targetNoteId}


module.exports = router;
