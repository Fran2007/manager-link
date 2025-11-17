import Folder from "../models/Folder.model.js";
import Link from "../models/Link.model.js";

export const getFolders = async (req, res) => {
  try {
    // Usar lean() para objetos planos más rápidos y select() para solo campos necesarios
    const folders = await Folder.find({ user: req.user.id })
      .select('name createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching folders", error: error.message });
  }
};

export const getFolder = async (req, res) => {
  try {
    // Optimizar: obtener solo campos necesarios y usar lean()
    const folder = await Folder.findOne({ _id: req.params.id, user: req.user.id })
      .select('name createdAt updatedAt')
      .lean();
    
    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Optimizar: obtener links con select() y lean() para mejor rendimiento
    const links = await Link.find({ folder: req.params.id, user: req.user.id })
      .select('title url createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ ...folder, links });
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
    // Retornar solo campos necesarios
    res.status(201).json({
      _id: folderSaved._id,
      name: folderSaved.name,
      user: folderSaved.user,
      createdAt: folderSaved.createdAt,
      updatedAt: folderSaved.updatedAt,
    });
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

