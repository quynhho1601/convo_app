import React, { useState } from 'react';
import '../css/PromptCard.css';

interface PromptCardProps {
    title: string;
    description: string;
    tags: string[];
    onClick: () => void;
    onDelete: () => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({ title, description, tags, onClick, onDelete }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click/hover effects
        try {
            await navigator.clipboard.writeText(description);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click
        try {
            const blob = new Blob([description], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            // Sanitize title for filename
            const filename = (title.toLowerCase().replace(/[\s\W_]+/g, '-').replace(/^-+|-+$/g, '') || 'prompt') + '.txt';
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
    
            setIsDownloaded(true);
            setTimeout(() => setIsDownloaded(false), 2000);
        } catch (err) {
            console.error('Failed to download file: ', err);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    return (
        <div className="prompt-card" onClick={onClick}>
            <div className="prompt-card-content">
                <h3 className="prompt-card-title">{title}</h3>
                <p className="prompt-card-description">{description}</p>
            </div>
            <div className="prompt-card-footer">
                <div className="prompt-card-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="prompt-card-tag">#{tag}</span>
                    ))}
                </div>
            </div>

            <div className="prompt-card-bottom-actions">
                <button
                    className={`prompt-card-action-button ${isDownloaded ? 'downloaded' : ''}`}
                    onClick={handleDownload}
                    aria-label="Download description"
                >
                    {isDownloaded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                    )}
                </button>
                <button 
                    className={`prompt-card-action-button ${isCopied ? 'copied' : ''}`} 
                    onClick={handleCopy}
                    aria-label="Copy description"
                >
                    {isCopied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    )}
                </button>
                <button
                    className="prompt-card-action-button delete-button"
                    onClick={handleDelete}
                    aria-label="Delete prompt"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                </button>
            </div>
        </div>
    );
};