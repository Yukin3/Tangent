const Folder = require('../models/Folders');

async function getFoldersService({ userId }) {
    if (!userId) {
      throw new Error('Missing userId');
    }
  
    const folders = await Folder.find({ userId }).sort({ createdAt: 1 });
    return folders;
}

async function createFolderService({ userId, name, parentId = null }) {
  let path = [];

  if (parentId) {
    const parentFolder = await Folder.findOne({ _id: parentId, userId });
    if (!parentFolder) {
      throw new Error('Parent folder not found or unauthorized.');
    }
    path = [...parentFolder.path, parentFolder.name];
  } else {
    path = ['root'];
  }

  const folder = await Folder.create({
    userId,
    name,
    parent: parentId,
    path,
    noteIds: [],
    isStarred: false
  });

  return folder;
}

async function updateFolderService({ folderId, userId, updates }) {
    if (!folderId || !userId) {
      throw new Error('Missing folderId or userId');
    }
  
    const allowedFields = ['name', 'isStarred'];
    const updateData = {};
  
    allowedFields.forEach((field) => {
      if (field in updates) {
        updateData[field] = updates[field];
      }
    });
  
    updateData.updatedAt = new Date();
  
    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: folderId, userId },
      updateData,
      { new: true }
    );
  
    if (!updatedFolder) {
      throw new Error('Folder not found or unauthorized');
    }
  
    return updatedFolder;
}

async function deleteFolderService({ folderId, userId }) {
    if (!folderId || !userId) {
      throw new Error('Missing folderId or userId');
    }
  
    const deleted = await Folder.findOneAndDelete({ _id: folderId, userId });
  
    if (!deleted) {
      throw new Error('Folder not found or unauthorized');
    }
  
    return deleted;
  }

module.exports = {
    getFoldersService,
    createFolderService,
    updateFolderService,
    deleteFolderService,
};
