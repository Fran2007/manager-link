import Folder from "../models/Folder.model.js";
import Link from "../models/Link.model.js";

export const getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching folders", error: error.message });
  }
};

export const getFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Get links in this folder
    const links = await Link.find({ folder: folder._id, user: req.user.id }).sort({ createdAt: -1 });

    res.json({ ...folder.toObject(), links });
  } catch (error) {
    res.status(500).json({ message: "Error fetching folder", error: error.message });
  }
};

export const createFolder = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const newFolder = new Folder({
      name,
      user: req.user.id,
    });

    const folderSaved = await newFolder.save();
    res.status(201).json(folderSaved);
  } catch (error) {
    res.status(500).json({ message: "Error creating folder", error: error.message });
  }
};

export const updateFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    if (name) folder.name = name;

    const folderUpdated = await folder.save();
    res.json(folderUpdated);
  } catch (error) {
    res.status(500).json({ message: "Error updating folder", error: error.message });
  }
};

export const deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Delete all links in this folder
    await Link.deleteMany({ folder: folder._id, user: req.user.id });

    // Delete the folder
    await Folder.findByIdAndDelete(folder._id);

    res.json({ message: "Folder and its links deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting folder", error: error.message });
  }
};

