import Link from "../models/Link.model.js";

export const getLinks = async (req, res) => {
  try {
    const { folderId } = req.query;
    const query = { user: req.user.id };
    
    if (folderId) {
      query.folder = folderId;
    }
    
    // Optimizar: usar select() y lean() para mejor rendimiento
    const links = await Link.find(query)
      .select('title url folder createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    res.json(links);
  } catch (error) {
    res.status(500).json({ message: "Error fetching links", error: error.message });
  }
};

export const getLink = async (req, res) => {
  try {
    const link = await Link.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json(link);
  } catch (error) {
    res.status(500).json({ message: "Error fetching link", error: error.message });
  }
};

export const createLink = async (req, res) => {
  try {
    const { title, url, folderId } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    if (!folderId) {
      return res.status(400).json({ message: "Folder ID is required" });
    }

    const newLink = new Link({
      title,
      url,
      user: req.user.id,
      folder: folderId,
    });

    const linkSaved = await newLink.save();
    // Retornar solo campos necesarios
    res.status(201).json({
      _id: linkSaved._id,
      title: linkSaved.title,
      url: linkSaved.url,
      folder: linkSaved.folder,
      createdAt: linkSaved.createdAt,
      updatedAt: linkSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating link", error: error.message });
  }
};

export const updateLink = async (req, res) => {
  try {
    const { title, url } = req.body;
    const link = await Link.findOne({ _id: req.params.id, user: req.user.id });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    if (title) link.title = title;
    if (url) link.url = url;

    const linkUpdated = await link.save();
    res.json(linkUpdated);
  } catch (error) {
    res.status(500).json({ message: "Error updating link", error: error.message });
  }
};

export const deleteLink = async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({ _id: req.params.id, user: req.user.id });

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.json({ message: "Link deleted successfully", link });
  } catch (error) {
    res.status(500).json({ message: "Error deleting link", error: error.message });
  }
};

