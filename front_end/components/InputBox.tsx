
import React, { useState } from 'react';

interface InputBoxProps {
    onDone: (contents: string[]) => void;
    onClose: () => void;
}

export const InputBox: React.FC<InputBoxProps> = ({ onDone, onClose }) => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    const handleDoneClick = () => {
        try {
            const parsed = JSON.parse(inputValue);
            if (!Array.isArray(parsed)) {
                throw new Error("Input must be a JSON array.");
            }
            const userContents = parsed
                .filter(item => item && item.role === 'user' && typeof item.content === 'string')
                .map(item => item.content);

            if (userContents.length === 0) {
                throw new Error("No items with 'role: user' found in the JSON array.");
            }
            setError('');
            onDone(userContents);
        } catch (e: any) {
            setError(`Invalid JSON: ${e.message}`);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>Import Chat</h2>
                <p>Paste a chat </p>
                <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='[{"role": "user", "content": "Hello!"}, ...]'
                />
                {error && <p className="error-message">{error}</p>}
                <button className="modal-button" onClick={handleDoneClick}>Done</button>
            </div>
        </div>
    );
};
