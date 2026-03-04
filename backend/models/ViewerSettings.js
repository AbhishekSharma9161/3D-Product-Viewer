import mongoose from 'mongoose';

const viewerSettingsSchema = new mongoose.Schema({
  backgroundColor: {
    type: String,
    default: '#1a1a1a'
  },
  wireframeMode: {
    type: Boolean,
    default: false
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('ViewerSettings', viewerSettingsSchema);
