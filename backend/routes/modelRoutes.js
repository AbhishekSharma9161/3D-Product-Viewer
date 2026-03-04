import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname, join, extname } from 'path';
import fs from 'fs';
import Model from '../models/Model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Multi-file storage: groups companion files (.bin, textures) in per-upload folders
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create a unique folder per upload batch so .gltf can resolve relative refs
    if (!req.uploadDir) {
      const folderName = Date.now() + '-' + Math.round(Math.random() * 1E9);
      req.uploadDir = join(__dirname, '../uploads', folderName);
      fs.mkdirSync(req.uploadDir, { recursive: true });
    }
    cb(null, req.uploadDir);
  },
  filename: (req, file, cb) => {
    // Keep original filename so .gltf references to .bin / textures still work
    cb(null, file.originalname);
  }
});

const ALLOWED_EXTENSIONS = ['.glb', '.gltf', '.bin', '.png', '.jpg', '.jpeg', '.webp'];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only GLB/GLTF and their companion files (bin, textures) are allowed'));
    }
  }
});

// Accept up to 20 files (main model + bin + textures)
router.post('/upload', upload.array('model', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Find the main model file (.gltf or .glb)
    const mainFile = req.files.find(f => {
      const ext = extname(f.originalname).toLowerCase();
      return ext === '.gltf' || ext === '.glb';
    });

    if (!mainFile) {
      return res.status(400).json({ error: 'No GLB/GLTF model file found in upload' });
    }

    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    // Get the relative folder name from the upload path
    const folderName = req.uploadDir.split(/[/\\]/).pop();
    const url = `${baseUrl}/uploads/${folderName}/${mainFile.originalname}`;

    try {
      const model = new Model({
        filename: mainFile.originalname,
        originalName: mainFile.originalname,
        url
      });
      await model.save();
      res.json({ url, id: model._id });
    } catch (dbError) {
      // If MongoDB is not connected, still return the URL
      console.log('MongoDB not available, returning URL without saving');
      res.json({ url, id: 'temp-' + Date.now() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const models = await Model.find().sort({ uploadDate: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
