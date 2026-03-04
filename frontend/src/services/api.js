import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const uploadModel = async (files) => {
  const formData = new FormData();

  // Support both FileList (from multi-file input) and single File
  if (files instanceof FileList || Array.isArray(files)) {
    for (const file of files) {
      formData.append('model', file);
    }
  } else {
    formData.append('model', files);
  }

  const response = await axios.post(`${API_BASE_URL}/models/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const saveSettings = async (settings) => {
  const response = await axios.post(`${API_BASE_URL}/settings`, settings);
  return response.data;
};

export const getLatestSettings = async () => {
  const response = await axios.get(`${API_BASE_URL}/settings/latest`);
  return response.data;
};
