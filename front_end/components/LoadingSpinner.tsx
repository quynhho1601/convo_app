import React from 'react';
import '../css/LoadingSpinner.css';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="spinner-overlay">
            <div className="spinner"></div>
        </div>
    );
};
