import React, { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiX, FiMoon, FiSun } from 'react-icons/fi';
import Note from '../../components/Note/Note';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import { useParams, useLocation } from 'react-router-dom';
import './Home.css';

const Home = ({ mode = 'list', filter = null }) => {
  const { notes, loading, error, fetchNotes, addNote, searchNotes, setSearchQuery, searchQuery, user } = useStore();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(mode === 'create');
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: []
  });
  const [newTag, setNewTag] = useState('');
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true'
  );
  const [filteredNotes, setFilteredNotes] = useState([]);
  const location = useLocation();

  // Set create modal open if mode is create
  useEffect(() => {
    if (mode === 'create') {
      setIsCreateModalOpen(true);
    }
  }, [mode]);

  // Filter notes based on the current filter
  useEffect(() => {
    if (!notes) return;
    
    let result = [...notes];
    
    if (filter === 'starred') {
      result = result.filter(note => note.isPinned);
    } else if (filter === 'tags') {
      // Group by tags is handled in the rendering
    }
    
    setFilteredNotes(result);
  }, [notes, filter]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchQuery(localSearchQuery);
    
    if (!localSearchQuery.trim()) {
      fetchNotes();
      return;
    }
    
    try {
      await searchNotes(localSearchQuery);
    } catch (error) {
      toast.error('Failed to search notes');
    }
  };

  const handleClearSearch = () => {
    setLocalSearchQuery('');
    setSearchQuery('');
    fetchNotes();
  };

  const handleCreateNoteSubmit = async (e) => {
    e.preventDefault();
    
    if (!newNote.title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    try {
      await addNote(newNote);
      setIsCreateModalOpen(false);
      setNewNote({
        title: '',
        content: '',
        tags: []
      });
      toast.success('Note created successfully');
    } catch (error) {
      toast.error('Failed to create note');
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (newNote.tags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    setNewNote({
      ...newNote,
      tags: [...newNote.tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const renderLoading = () => (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading notes...</p>
    </div>
  );

  const renderError = () => (
    <div className="error-container">
      <p className="error-message">{error}</p>
      <button onClick={fetchNotes} className="retry-button">
        Retry
      </button>
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <img 
        src="/empty-notes.svg" 
        alt="No notes found" 
        className="empty-state-image"
      />
      <h2>No notes found</h2>
      <p>Start creating your first note to keep track of your ideas.</p>
      <button onClick={() => setIsCreateModalOpen(true)} className="create-note-button primary">
        <FiPlus /> Create Your First Note
      </button>
    </div>
  );

  const renderProfile = () => (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user && user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </div>
          <h2>{user ? user.fullName : 'User'}</h2>
          <p>{user ? user.email : 'user@example.com'}</p>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <h3>{notes ? notes.length : 0}</h3>
            <p>Total Notes</p>
          </div>
          <div className="stat-item">
            <h3>{notes ? notes.filter(note => note.isPinned).length : 0}</h3>
            <p>Starred Notes</p>
          </div>
        </div>
        <div className="profile-actions">
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FiSun /> : <FiMoon />} 
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Render tags view with notes grouped by tags
  const renderTagsView = () => {
    // Get all unique tags
    const allTags = new Set();
    notes.forEach(note => {
      note.tags.forEach(tag => allTags.add(tag));
    });
    
    const tagsList = Array.from(allTags);
    
    return (
      <div className="tags-view">
        <h1>Tags</h1>
        {tagsList.length === 0 ? (
          <div className="empty-tags">
            <p>No tags found. Add tags to your notes to organize them better.</p>
          </div>
        ) : (
          <div className="tags-list">
            {tagsList.map(tag => (
              <div key={tag} className="tag-group">
                <h2 className="tag-title">#{tag}</h2>
                <div className="notes-container">
                  <div className="notes-grid">
                    {notes
                      .filter(note => note.tags.includes(tag))
                      .map(note => (
                        <Note key={note._id} note={note} />
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Handle which content to render based on mode
  const renderContent = () => {
    if (mode === 'profile') {
      return renderProfile();
    }
    
    if (filter === 'tags') {
      return renderTagsView();
    }
    
    if (filter === 'starred') {
      return (
        <>
          <h1>Starred Notes</h1>
          {filteredNotes.length === 0 ? (
            <div className="empty-starred">
              <p>No starred notes. Star your important notes to see them here.</p>
            </div>
          ) : (
            <div className="notes-container">
              <div className="notes-grid">
                {filteredNotes.map(note => (
                  <Note key={note._id} note={note} />
                ))}
              </div>
            </div>
          )}
        </>
      );
    }
    
    // Default view
    return (
      <>
        <h1>My Notes</h1>
        
        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search notes..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="search-input"
              />
              {localSearchQuery && (
                <button 
                  type="button" 
                  onClick={handleClearSearch} 
                  className="clear-search-button"
                >
                  <FiX />
                </button>
              )}
            </div>
          </form>
          
          <div className="action-buttons">
            <button 
              onClick={toggleDarkMode} 
              className="theme-toggle-button"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            
            <button 
              onClick={() => setIsCreateModalOpen(true)} 
              className="create-note-button"
            >
              <FiPlus /> New Note
            </button>
          </div>
        </div>
        
        {notes.length === 0 ? renderEmptyState() : (
          <div className="notes-container">
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <Note key={note._id} note={note} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  const renderCreateNoteModal = () => (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Create New Note</h2>
          <button 
            onClick={() => setIsCreateModalOpen(false)} 
            className="modal-close-button"
          >
            <FiX />
          </button>
        </div>
        <form onSubmit={handleCreateNoteSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Enter note title"
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              placeholder="Enter note content"
              className="form-control content-textarea"
              rows="8"
            />
          </div>
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-group">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="form-control tag-input"
              />
              <button 
                type="button" 
                onClick={handleAddTag} 
                className="add-tag-btn"
              >
                <FiPlus /> Add
              </button>
            </div>
            <div className="tags-container">
              {newNote.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)} 
                    className="remove-tag-btn"
                  >
                    <FiX />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)} 
              className="cancel-button"
            >
              Cancel
            </button>
            <button type="submit" className="save-button">
              Create Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (loading) return renderLoading();
  if (error) return renderError();

  return (
    <div className={`home-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="home-header">
        {renderContent()}
      </div>
      
      {isCreateModalOpen && renderCreateNoteModal()}
    </div>
  );
};

export default Home;
