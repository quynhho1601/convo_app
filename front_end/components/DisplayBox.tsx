import React, { useState, useEffect } from "react";
import "../css/display-box.css";

interface DisplayBoxProps {
  isOpen: boolean;
  content: string;
  onClose: () => void;
  onSave: (promptData: { title: string; description: string; tags: string[] }) => void;
}

export const DisplayBox: React.FC<DisplayBoxProps> = ({
  isOpen,
  content,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [editableContent, setEditableContent] = useState(content);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTags('');
      setError('');
      setEditableContent(content);
    }
  }, [isOpen, content]);
  
  // Sync updates from streaming backend into the textarea
  useEffect(() => {
    if (isOpen) {
      setEditableContent(content);
    }
  }, [content, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      setError('A title is required to save the prompt.');
      return;
    }
    setError('');

    const tagArray = tags
      .split(/[\s,]+/)
      .map(tag => (tag.startsWith('#') ? tag.substring(1).trim() : tag.trim()))
      .filter(Boolean);

    onSave({
      title,
      description: editableContent,
      tags: tagArray,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="response-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="response-header">
            <h2 className="response-title">Generated Prompt</h2>
            <button className="response-close-button" onClick={onClose}>&times;</button>
        </div>

        <div className="response-scroll-area">
            <textarea
                className="prompt-paragraph"
                value={editableContent}
                onChange={(e) => setEditableContent(e.target.value)}
                aria-label="Editable prompt content"
            />
        </div>

        <div className="save-prompt-form">
          <div className="input-group">
            <input
                type="text"
                className="prompt-input title-input"
                placeholder="Enter a title for your prompt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Prompt title"
            />
            <input
                type="text"
                className="prompt-input tags-input"
                placeholder="Add tags (e.g., python api)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                aria-label="Prompt tags"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button className="save-button" onClick={handleSave}>Save Prompt</button>
        </div>
      </div>
    </div>
  );
};