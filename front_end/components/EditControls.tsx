import React, { useState } from 'react';
import '../css/EditControls.css';

interface EditControlsProps {
    isGridVisible: boolean;
    onToggleGrid: () => void;
    isClassificationVisible: boolean;
    onClassifyNodes: () => void;
}

export const EditControls: React.FC<EditControlsProps> = ({ isGridVisible, onToggleGrid, isClassificationVisible, onClassifyNodes }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="edit-controls-container">
            <div className={`edit-controls-menu ${isMenuOpen ? 'open' : ''}`}>
                <button
                    className={`control-button ${isClassificationVisible ? 'active' : ''}`}
                    onClick={onClassifyNodes}
                    aria-label={isClassificationVisible ? 'Hide Classification' : 'Classify Ideas'}
                    title={isClassificationVisible ? 'Hide Classification' : 'Classify Ideas'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 11-6 6v3h9l6-6Z"/>
                        <path d="m15 5 3 3"/>
                    </svg>
                </button>
                <button 
                    className={`control-button ${isGridVisible ? 'active' : ''}`}
                    onClick={onToggleGrid}
                    aria-label={isGridVisible ? 'Hide Grid' : 'Show Grid'}
                    title={isGridVisible ? 'Hide Grid' : 'Show Grid'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 3v18"/>
                    </svg>
                </button>
            </div>
            <button 
                className="main-fab" 
                onClick={() => setIsMenuOpen(prev => !prev)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle Edit Controls"
            >
                 <svg className="fab-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
        </div>
    );
};
