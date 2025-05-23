import axios from 'axios';
import { getToken } from './tokenService';

const API_URL = 'http://localhost:8000'; // Backend server URL

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    // Add token to header if it's not an auth path and token exists
    // Assuming auth paths start with '/auth/'
    if (token && config.url && !config.url.startsWith('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (email, password) => {
  try {
    // Use apiClient for consistency, though it won't add a token for /auth/ users
    const response = await apiClient.post(`/auth/users/`, {
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    // Use apiClient for consistency
    const response = await apiClient.post(`/auth/token/`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchStories = async () => {
  try {
    // This request will now automatically include the token if available
    const response = await apiClient.get(`/stories_api/`);
    return response.data;
  } catch (error) {
    console.error("Fetch stories error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAISuggestions = async (topic, heroName, ageGroup) => {
  try {
    const response = await apiClient.post(`/stories_api/suggest-story/`, {
      topic: topic,
      hero_name: heroName, // Ensure snake_case matches Pydantic model
      age_group: ageGroup,   // Ensure snake_case matches Pydantic model
    });
    return response.data; // Should be {"suggested_title": "...", "suggested_draft": "..."}
  } catch (error) {
    console.error("Get AI suggestions error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const saveStory = async (title, content) => {
  try {
    const response = await apiClient.post(`/stories_api/`, {
      title: title,
      content: content,
    });
    return response.data; // Returns the created story object
  } catch (error) {
    console.error("Save story error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchStoryById = async (storyId) => {
  try {
    const response = await apiClient.get(`/stories_api/${storyId}`);
    return response.data;
  } catch (error) {
    console.error(`Fetch story by ID (${storyId}) error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateStoryById = async (storyId, title, content) => {
  try {
    const response = await apiClient.put(`/stories_api/${storyId}`, {
      title: title,
      content: content,
    });
    return response.data;
  } catch (error) {
    console.error(`Update story by ID (${storyId}) error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const generateStoryImage = async (storyId) => {
  try {
    const response = await apiClient.post(`/stories_api/${storyId}/generate-image`);
    return response.data; // Expected: { image_url: "..." }
  } catch (error) {
    console.error(`Generate story image for ID (${storyId}) error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const generateStoryColoringPage = async (storyId) => {
  try {
    const response = await apiClient.post(`/stories_api/${storyId}/generate-coloring-page`);
    return response.data; // Expected: { coloring_image_url: "..." }
  } catch (error) {
    console.error(`Generate story coloring page for ID (${storyId}) error:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export default apiClient; // Export the configured client if needed elsewhere, or just use functions
