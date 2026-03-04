import { useState, useRef } from 'react';
import './Controls.css';

// Parse a GLTF JSON to find all external file references (buffers + images)
async function getMissingCompanions(gltfFile, allFiles) {
  try {
    const text = await gltfFile.text();
    const json = JSON.parse(text);
    const allFileNames = new Set([...allFiles].map(f => f.name));

    const missing = [];

    // Check buffer URIs
    if (json.buffers) {
      for (const buf of json.buffers) {
        if (buf.uri && !buf.uri.startsWith('data:')) {
          const filename = buf.uri.split('/').pop();
          if (!allFileNames.has(filename)) {
            missing.push(filename);
          }
        }
      }
    }

    // Check image URIs
    if (json.images) {
      for (const img of json.images) {
        if (img.uri && !img.uri.startsWith('data:')) {
          const filename = img.uri.split('/').pop();
          if (!allFileNames.has(filename)) {
            missing.push(filename);
          }
        }
      }
    }

    return missing;
  } catch {
    return [];
  }
}

function Controls({
  setLocalFiles,
  setModelUrl,
  backgroundColor,
  setBackgroundColor,
  wireframeMode,
  setWireframeMode,
  onSaveSettings
}) {
  const [fileLabel, setFileLabel] = useState('');
  const [missingFiles, setMissingFiles] = useState([]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const mainFile = [...files].find(f => /\.(gltf|glb)$/i.test(f.name));
    if (!mainFile) {
      alert('Please select a .gltf or .glb file.');
      return;
    }

    // For GLTF, check if companion files (.bin, textures) are also selected
    if (mainFile.name.endsWith('.gltf')) {
      const missing = await getMissingCompanions(mainFile, files);
      if (missing.length > 0) {
        setMissingFiles(missing);
        setFileLabel(mainFile.name);
        setLocalFiles(null);
        setModelUrl(null);
        return; // Don't load — file is incomplete
      }
    }

    setMissingFiles([]);
    setModelUrl(null);
    setLocalFiles(files);
    setFileLabel(
      mainFile.name + (files.length > 1 ? ` + ${files.length - 1} companion file(s)` : '')
    );
  };

  const handleLoadAnyway = () => {
    if (fileInputRef.current?.files) {
      const files = fileInputRef.current.files;
      const mainFile = [...files].find(f => /\.(gltf|glb)$/i.test(f.name));
      if (mainFile) {
        setMissingFiles([]);
        setModelUrl(null);
        setLocalFiles(files);
        setFileLabel(
          mainFile.name + (files.length > 1 ? ` + ${files.length - 1} companion file(s)` : '')
        );
      }
    }
  };

  const handleFolderChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const mainFile = [...files].find(f => /\.(gltf|glb)$/i.test(f.name));
    if (!mainFile) {
      alert('No .gltf or .glb file found in the selected folder.');
      return;
    }

    // For folder uploads, we assume all necessary files are included
    setMissingFiles([]);
    setModelUrl(null);
    setLocalFiles(files);
    setFileLabel(
      `📁 ${mainFile.name} + ${files.length - 1} file(s) from folder`
    );
  };

  return (
    <div className="controls-panel">
      <div className="control-group">
        <label>Upload 3D Model</label>
        <div className="file-input-wrapper">
          <input
            ref={fileInputRef}
            type="file"
            id="model-upload"
            accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp,.ktx2"
            multiple
            onChange={handleFileChange}
          />
          <button
            className="file-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </button>
        </div>

        <div className="file-input-wrapper" style={{ marginTop: '8px' }}>
          <input
            ref={folderInputRef}
            type="file"
            id="folder-upload"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFolderChange}
          />
          <button
            className="file-button folder-button"
            onClick={() => folderInputRef.current?.click()}
          >
            📁 Choose Folder
          </button>
        </div>

        {fileLabel && !missingFiles.length && (
          <div className="upload-status">✅ {fileLabel}</div>
        )}

        {missingFiles.length > 0 && (
          <div className="missing-files-warning">
            <strong>⚠️ Missing companion files:</strong>
            <ul>
              {missingFiles.map(f => <li key={f}><code>{f}</code></li>)}
            </ul>
            <p className="instruction-text">
              <strong>How to fix:</strong><br />
              1. Click "Choose GLB/GLTF File" again<br />
              2. Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd> on Mac)<br />
              3. Select <strong>{fileLabel}</strong> + all the files listed above<br />
              4. Click "Open"
            </p>
            <button className="load-anyway-button" onClick={handleLoadAnyway}>
              Try Loading Anyway
            </button>
          </div>
        )}

        <p className="file-tip">
          💡 <strong>.glb</strong> = single file, always works.<br />
          <strong>.gltf</strong> = use "Choose Folder" to upload all files together.<br />
          Or select .gltf + .bin + textures with Ctrl/Cmd + click.
        </p>
      </div>

      <div className="control-group">
        <label>Background Color</label>
        <input
          type="color"
          className="color-input"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      <div className="control-group">
        <label>Wireframe Mode</label>
        <div className="toggle-wrapper">
          <div
            className={`toggle ${wireframeMode ? 'active' : ''}`}
            onClick={() => setWireframeMode(!wireframeMode)}
          >
            <div className="toggle-slider" />
          </div>
          <span>{wireframeMode ? 'On' : 'Off'}</span>
        </div>
      </div>

      <button className="save-button" onClick={onSaveSettings}>
        Save Settings
      </button>
    </div>
  );
}

export default Controls;
