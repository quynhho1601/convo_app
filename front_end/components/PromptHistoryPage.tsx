
import React, { useState, useMemo } from 'react';
import '../css/PromptHistoryPage.css';
import { PromptCard } from './PromptCard';
import { PromptDetailModal } from './PromptDetailModal';

interface PromptData {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

interface PromptHistoryPageProps {
    onBack: () => void;
    prompts: PromptData[];
    onDelete: (id: string) => void;
}

export const PromptHistoryPage: React.FC<PromptHistoryPageProps> = ({ onBack, prompts, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPrompt, setSelectedPrompt] = useState<PromptData | null>(null);

    const handleDeletePrompt = (idToDelete: string) => {
        // Close modal if the deleted prompt is the one being viewed
        if (selectedPrompt && selectedPrompt.id === idToDelete) {
            setSelectedPrompt(null);
        }
        onDelete(idToDelete);
    };

    const filteredPrompts = useMemo(() => {
        const searchTags = searchTerm
            .toLowerCase()
            .split(' ')
            .map(tag => tag.startsWith('#') ? tag.substring(1) : tag)
            .filter(Boolean);
        
        if (searchTags.length === 0) {
            return prompts;
        }

        return prompts.filter(prompt => {
            const promptTagsLower = prompt.tags.map(t => t.toLowerCase());
            return searchTags.every(searchTag => promptTagsLower.includes(searchTag));
        });
    }, [prompts, searchTerm]);
    
    const handleCardClick = (prompt: PromptData) => {
        setSelectedPrompt(prompt);
    };

    return (
        <div className="history-page-container">
            <header className="history-page-header">
                <h1 className="history-page-title">Convo</h1>
                <button className="app-button" onClick={onBack}>Back</button>
            </header>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by tags (e.g., python fastapi)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search prompts by tags"
                />
            </div>
            <main className="history-prompt-grid">
                {filteredPrompts.map(item => (
                    <PromptCard 
                        key={item.id}
                        title={item.title}
                        description={item.description}
                        tags={item.tags}
                        onClick={() => handleCardClick(item)}
                        onDelete={() => handleDeletePrompt(item.id)}
                    />
                ))}
            </main>
            {selectedPrompt && (
                <PromptDetailModal
                    prompt={selectedPrompt}
                    onClose={() => setSelectedPrompt(null)}
                    onDelete={() => handleDeletePrompt(selectedPrompt.id)}
                />
            )}
        </div>
    );
};
