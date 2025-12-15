
import React, { useState, useRef, useEffect } from 'react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import '../css/bingo-marker.css';

interface BingoMarkerProps {
    id: string;
    label?: { top: string, bottom: string };
    position: { x: number; y: number };
    scale: number;
    onDrag: (id: string, delta: { dx: number, dy: number }) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    content?: string;
    isSelected?: boolean;
    order?: number;
    classification?: 'unique' | 'irrelevant';
    isClassificationVisible?: boolean;
}


export const BingoMarker: React.FC<BingoMarkerProps> = ({ id, label, position, scale, onDrag, onDragStart, onDragEnd, content, isSelected, order, classification, isClassificationVisible }) => {
    const markerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (!markerRef.current) return;

        const dragHandler = drag<HTMLDivElement, unknown>()
            .on('start', (event) => {
                event.sourceEvent.preventDefault();
                event.sourceEvent.stopPropagation();
                setIsDragging(true);
                onDragStart();
            })
            .on('drag', (event) => {
                onDrag(id, { dx: event.dx / scale, dy: event.dy / scale });
            })
            .on('end', () => {
                setIsDragging(false);
                onDragEnd();
            });
        
        select(markerRef.current).call(dragHandler);
    }, [id, scale, onDrag, onDragStart, onDragEnd]);
    
    const style = {
        '--dx': `${position.x}px`,
        '--dy': `${position.y}px`,
        zIndex: isDragging ? 100 : 'auto',
    } as React.CSSProperties;

    const classNames = [
        'bingo-marker',
        isDragging && 'dragging',
        label && 'special-marker',
        isSelected && 'selected',
    ].filter(Boolean).join(' ');

    return (
        <div
            ref={markerRef}
            className={classNames}
            style={style}
        >
            {isClassificationVisible && classification === 'unique' && (
                <div className="classification-icon" title="Unique Idea">📌</div>
            )}
            {order && <div className="node-order-badge">{order}</div>}
            {label && (
                <div className="marker-label">
                    <span>{label.top}</span>
                    <div className="label-divider"></div>
                    <span>{label.bottom}</span>
                </div>
            )}
            {content && <div className="bingo-marker-tooltip">{content}</div>}
        </div>
    );
};
