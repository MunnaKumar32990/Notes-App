import { create } from 'zustand';
import axios from 'axios';

const API_URL = '/api';

const useStore = create((set, get) => ({
  user: null,
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  darkMode: localStorage.getItem('darkMode') === 'true',

  // User actions
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  // Authentication actions
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data.error === false) {
        localStorage.setItem('token', response.data.accessToken);
        
        // Set user if available in response
        set({ 
          user: response.data.user, 
          loading: false 
        });
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Login failed', 
        loading: false 
      });
      throw error;
    }
  },

  signup: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axios.post(`${API_URL}/create-account`, userData);
      
      if (response.data.error === false) {
        localStorage.setItem('token', response.data.accessToken);
        set({ user: response.data.user, loading: false });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Signup failed', 
        loading: false 
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, notes: [] });
  },

  // User profile actions
  updateProfile: async (userData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/update-profile`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set({ user: response.data.user, loading: false });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Profile update failed');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Profile update failed', 
        loading: false 
      });
      throw error;
    }
  },

  // Notes actions
  setNotes: (notes) => set({ notes }),
  
  addNote: async (note) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/add-note`, note, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set((state) => ({ 
          notes: [response.data.note, ...state.notes],
          loading: false 
        }));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to add note');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to add note',
        loading: false 
      });
      throw error;
    }
  },

  updateNote: async (noteId, updates) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/edit-note/${noteId}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set((state) => ({
          notes: state.notes.map((note) =>
            note._id === noteId ? response.data.note : note
          ),
          loading: false
        }));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to update note');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to update note',
        loading: false 
      });
      throw error;
    }
  },

  deleteNote: async (noteId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${API_URL}/delete-note/${noteId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set((state) => ({
          notes: state.notes.filter((note) => note._id !== noteId),
          loading: false
        }));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to delete note');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to delete note',
        loading: false 
      });
      throw error;
    }
  },

  fetchNotes: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/get-all-notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set({ 
          notes: response.data.notes, 
          loading: false,
          searchQuery: '' 
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch notes');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to fetch notes', 
        loading: false 
      });
      throw error;
    }
  },

  searchNotes: async (query) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/search-notes?query=${query}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.error === false) {
        set({ 
          notes: response.data.notes,
          loading: false
        });
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to search notes');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to search notes',
        loading: false 
      });
      throw error;
    }
  },

  togglePin: async (noteId) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const note = get().notes.find((n) => n._id === noteId);
      
      if (!note) {
        throw new Error('Note not found');
      }
      
      const response = await axios.put(
        `${API_URL}/update-note-pinned/${noteId}`,
        { isPinned: !note.isPinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.error === false) {
        set((state) => ({
          notes: state.notes.map((n) =>
            n._id === noteId ? { ...n, isPinned: !n.isPinned } : n
          ),
          loading: false
        }));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to toggle pin');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message || 'Failed to toggle pin',
        loading: false 
      });
      throw error;
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Dark mode toggle
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    localStorage.setItem('darkMode', newDarkMode);
    set({ darkMode: newDarkMode });
  },
  
  setDarkMode: (value) => {
    localStorage.setItem('darkMode', value);
    set({ darkMode: value });
  },

  // Error handling
  setError: (error) => set({ error }),
  clearError: () => set({ error: null })
}));

export default useStore; 