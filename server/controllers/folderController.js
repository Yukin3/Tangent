const { createFolderService, getFoldersService, updateFolderService, deleteFolderService } = require('../services/folderService');


async function getFolders(req, res) {
    try {
      const { userId } = req.query;
  
      const folders = await getFoldersService({ userId });
      res.status(200).json({ success: true, data: folders });
    } catch (err) {
      console.error('❌ Get folders error:', err);
      res.status(400).json({ success: false, message: err.message });
    }
}
  

async function createFolder(req, res) {
  try {
    const { name, parent } = req.body;
    const userId = req.body.userId || "67fac1a01a17138d8e741589";

    const folder = await createFolderService({
      userId,
      name,
      parentId: parent || null,
    });

    res.status(201).json({ success: true, data: folder });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'A folder with this name already exists in this location.' });
    }
    console.error('❌ Folder creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
}

async function updateFolder(req, res) {
    try {
      const { folderId, userId, ...updates } = req.body;
  
      if (!folderId || !userId) {
        return res.status(400).json({ success: false, message: 'Missing folderId or userId' });
      }
  
      const folder = await updateFolderService({
        folderId,
        userId,
        updates,
      });
  
      res.status(200).json({ success: true, data: folder });
    } catch (err) {
      console.error('❌ Folder update error:', err);
      res.status(400).json({ success: false, message: err.message });
    }
}
  
async function deleteFolder(req, res) {
    try {
      const { folderId, userId } = req.body;
  
      if (!folderId || !userId) {
        return res.status(400).json({ success: false, message: 'Missing folderId or userId' });
      }
  
      const deleted = await deleteFolderService({ folderId, userId });
      res.status(200).json({ success: true, message: 'Folder deleted', data: deleted });
    } catch (err) {
      console.error('❌ Folder delete error:', err);
      res.status(400).json({ success: false, message: err.message });
    }
}

module.exports = {
  getFolders,
  createFolder,
  updateFolder,
  deleteFolder,
};
