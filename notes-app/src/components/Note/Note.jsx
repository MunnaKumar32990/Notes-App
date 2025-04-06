import React, { useState, useEffect, useRef } from 'react';
import { FiMapPin, FiTrash2, FiSave, FiEdit2, FiX, FiTag, FiPlus } from 'react-icons/fi';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useStore from '../../store/useStore';
import toast from 'react-hot-toast';
import './Note.css';

const Note = ({ note }) => {
  const { updateNote, deleteNote, togglePin } = useStore();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const noteRef = useRef(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags || []);
  }, [note]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (noteRef.current && !noteRef.current.contains(event.target) && isEditing) {
        handleSave();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, title, content, tags]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title cannot be empty');
      return;
    }
    
    try {
      await updateNote(note._id, {
        title,
        content,
        tags
      });
      setIsEditing(false);
      toast.success('Note saved successfully');
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  const handleDelete = async () => {
    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true);
      return;
    }
    
    try {
      await deleteNote(note._id);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    } finally {
      setIsConfirmingDelete(false);
    }
  };

  const handlePinToggle = async () => {
    try {
      await togglePin(note._id);
      toast.success(note.isPinned ? 'Note unpinned' : 'Note pinned');
    } catch (error) {
      toast.error('Failed to update pin status');
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) {
      toast.error('Tag already exists');
      return;
    }
    setTags([...tags, newTag.trim()]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsEditing(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format the note content to display properly in a horizontal card
  const formatContent = (htmlContent) => {
    // Create a temporary div to parse the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Remove any large images or tables that might break the layout
    const images = tempDiv.querySelectorAll('img');
    images.forEach(img => {
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      img.style.maxHeight = '80px';
    });
    
    return tempDiv.innerHTML;
  };

  return (
    <div 
      ref={noteRef}
      className={`note-card ${note.isPinned ? 'pinned' : ''} ${isExpanded ? 'expanded' : ''}`}
      onClick={() => !isEditing && !isExpanded && toggleExpand()}
    >
      <div className="note-header">
        <div className="note-actions">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePinToggle();
            }}
            className={`pin-button ${note.isPinned ? 'pinned' : ''}`}
            title={note.isPinned ? "Unpin note" : "Pin note"}
          >
            <FiMapPin />
          </button>
          
          {!isEditing ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setIsExpanded(true);
              }} 
              className="edit-button"
              title="Edit note"
            >
              <FiEdit2 />
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }} 
              className="save-button"
              title="Save note"
            >
              <FiSave />
            </button>
          )}
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }} 
            className={`delete-button ${isConfirmingDelete ? 'confirming' : ''}`}
            title={isConfirmingDelete ? "Click again to confirm" : "Delete note"}
          >
            <FiTrash2 />
          </button>
          
          {isExpanded && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
                setIsEditing(false);
              }} 
              className="close-button"
              title="Close"
            >
              <FiX />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="note-title-input"
            placeholder="Note title"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="note-title">
            {title}
          </h3>
        )}
      </div>

      <div className="note-content" onClick={(e) => isExpanded && e.stopPropagation()}>
        {isEditing ? (
          <ReactQuill
            value={content}
            onChange={setContent}
            className="note-editor"
            modules={{
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }}
          />
        ) : (
          <div
            className="note-preview"
            dangerouslySetInnerHTML={{ __html: formatContent(content) }}
          />
        )}
      </div>

      <div className="note-footer">
        {isEditing && (
          <div className="tag-input-container">
            <FiTag className="tag-icon" />
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="tag-input"
              onClick={(e) => e.stopPropagation()}
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddTag();
              }} 
              className="add-tag-button"
            >
              <FiPlus />
            </button>
          </div>
        )}
        
        <div className="note-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              {isEditing && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag);
                  }} 
                  className="remove-tag"
                >
                  <FiX />
                </button>
              )}
            </span>
          ))}
        </div>
        
        <div className="note-date">
          {formatDate(note.createdOn)}
        </div>
      </div>
    </div>
  );
};

export default Note; 