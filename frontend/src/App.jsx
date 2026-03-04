import { useState, useEffect } from 'react';
import Viewer3D from './components/Viewer3D';
import Controls from './components/Controls';
import { saveSettings, getLatestSettings } from './services/api';
import './App.css';

function App() {
  const [localFiles, setLocalFiles] = useState(null); // FileList from local picker
  const [modelUrl, setModelUrl] = useState(null);     // URL from server (optional)
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');
  const [wireframeMode, setWireframeMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await getLatestSettings();
      if (settings) {
        setBackgroundColor(settings.backgroundColor);
        setWireframeMode(settings.wireframeMode);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await saveSettings({ backgroundColor, wireframeMode });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>3D Product Viewer</h1>
      </header>
      
      <div className="main-content">
        <Viewer3D 
          localFiles={localFiles}
          modelUrl={modelUrl}
          backgroundColor={backgroundColor}
          wireframeMode={wireframeMode}
        />
        
        <Controls
          setLocalFiles={setLocalFiles}
          setModelUrl={setModelUrl}
          backgroundColor={backgroundColor}
          setBackgroundColor={setBackgroundColor}
          wireframeMode={wireframeMode}
          setWireframeMode={setWireframeMode}
          onSaveSettings={handleSaveSettings}
        />
      </div>
    </div>
  );
}

export default App;
