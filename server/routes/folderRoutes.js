const express = require('express');
const router = express.Router();
const { createFolder, getFolders, updateFolder, deleteFolder } = require('../controllers/folderController');

router.get('/', getFolders);
router.post('/', createFolder);
router.put('/', updateFolder);
router.delete('/', deleteFolder);


module.exports = router;
