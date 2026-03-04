import express from 'express';
import ViewerSettings from '../models/ViewerSettings.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { backgroundColor, wireframeMode } = req.body;
    
    try {
      const settings = new ViewerSettings({
        backgroundColor,
        wireframeMode,
        timestamp: new Date()
      });
      await settings.save();
      res.json(settings);
    } catch (dbError) {
      // If MongoDB is not connected, return the settings without saving
      console.log('MongoDB not available, returning settings without saving');
      res.json({ backgroundColor, wireframeMode, timestamp: new Date() });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/latest', async (req, res) => {
  try {
    const settings = await ViewerSettings.findOne().sort({ timestamp: -1 });
    res.json(settings || { backgroundColor: '#1a1a1a', wireframeMode: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
