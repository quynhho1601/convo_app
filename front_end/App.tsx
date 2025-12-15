
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BingoMarker } from './components/Node';
import { InputBox } from './components/InputBox';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DisplayBox } from "./components/DisplayBox";
import { PromptHistoryPage } from './components/PromptHistoryPage';
import { EditControls } from './components/EditControls';
import { GENERATE_PROMPT_ENDPOINT, CLASSIFY_NODES_ENDPOINT } from "./src/config";


interface CircleData {
    id: string;
    label?: { top: string; bottom: string };
    position: { x: number; y: number };
}

interface NodeData {
    id:string;
    content: string;
    position: { x: number; y: number };
    order?: number;
    classification?: 'unique' | 'irrelevant';
}

export interface PromptData {
    id: string;
    title: string;
    description: string;
    tags: string[];
}

const bingoItems = ["TASK","TECH CONTEXT","OUTPUT FORMAT","ROLE","CONSTRAINTS",
  "Write code for [functionality]",
  "Use [programming language]",
  "Provide [code snippet type]",
  "Act as [role/expertise]",
  "Follow [coding standards]",
  
  "Debug [specific issue]",
  "Work in [tech stack]",
  "Show step-by-step log",
  "Handle as [role/expertise]",
  "Avoid [restricted libraries]",
  
  "Optimize [algorithm/function]",
  "Implement in [language/assembly]",
  "Add annotated explanations",
  "Focus as [role/expertise]",
  "Explain steps and trade-offs",
  
  "Refactor [project/component]",
  "Use [framework/library]",
  "Make structure modular",
  "Act as [role/expertise]",
  "Ensure maintainability",
 // Blank space
];

const initialPromptHistoryData = [
    { title: 'FastAPI Python Cursor Rules', description: 'You are an expert in Python, FastAPI, and scalable API development....', tags: ['python', 'fastapi', 'api'] },
    { title: 'Jupyter Data Analyst Python Cursor Rules', description: 'You are an expert in data analysis, visualization, and Jupyter No...', tags: ['python', 'jupyter', 'data analysis'] },
    { title: 'Deep Learning Developer Python Cursor Rules', description: 'You are an expert in deep learning, transformers, diffusion model...', tags: ['python', 'pytorch', 'tensorflow'] },
    { title: 'Django Python Cursor Rules', description: 'You are an expert in Python, Django, and scalable web application d...', tags: ['django', 'python'] },
    { title: 'Flask Python Cursor Rules', description: 'You are an expert in Python, Flask, and scalable API development.', tags: ['python', 'flask', 'api'] },
    { title: 'FastAPI Python Microservices Serverless C...', description: 'You are an expert in Python, FastAPI, microservices architecture, a...', tags: ['fastapi', 'uvicorn', 'redis', 'microservices'] },
    { title: 'Python Function Reflection Assistant', description: 'You are a Python programming assistant. You will be given a function ...', tags: ['python', 'code generation'] },
    { title: 'JAX Best Practices', description: 'You are an expert in JAX, Python, NumPy, and Machine Learning.', tags: ['jax', 'numpy', 'machine learning'] },
    { title: 'Sentry.io - Build with AI, debug broken c...', description: 'Monitor your AI agents with Sentry. Cursor.directory users get 3 months free of our team plan here.', tags: ['sentry', 'ai', 'debugging'] },
    { title: 'Modern Web Scraping', description: 'You are an expert in web scraping and data extraction, with a...', tags: ['web scraping', 'beautifulsoup', 'firecrawl'] },
    { title: 'Python Test Case Generator', description: 'Test Case Generation Prompt. You are an AI coding assistant that can w...', tags: ['python', 'testing', 'unittest'] },
    { title: 'RoboCorp Python Cursor Rules', description: 'You are an expert in Python, RoboCorp, and scalable RPA development...', tags: ['python', 'rpa', 'robocorp'] },
];

const initialPrompts: PromptData[] = initialPromptHistoryData.map((prompt, index) => ({
    ...prompt,
    id: `prompt-${index}`
}));

const App: React.FC = () => {
    //State to set view for History
    const [view, setView] = useState<'main' | 'history'>('main');

    //State control the visibility of the "Paste JSON" pop-up box. 
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for loading the response display box
    const [isGenerating, setIsGenerating] = useState(false);

    // State for backend response display box
    const [modelResponse, setModelResponse] = useState<string | null>(null);
    const [isResponseBoxOpen, setIsResponseBoxOpen] = useState(false);

    // Prompt History state
    const [prompts, setPrompts] = useState<PromptData[]>(initialPrompts);
    
    // Bingo state
    const [circles, setCircles] = useState<CircleData[]>([]);

    // Node state
    const [userNodes, setUserNodes] = useState<NodeData[]>([]);
    const rightPanelRef = useRef<HTMLElement>(null);

    // Multi-select state
    const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
    
    const handleBingoMarkerDrag = useCallback((id: string, delta: { dx: number; dy: number }) => {
        setCircles(prevCircles =>
            prevCircles.map(circle =>
                circle.id === id
                    ? { ...circle, position: { x: circle.position.x + delta.dx, y: circle.position.y + delta.dy } }
                    : circle
            )
        );
    }, []);

    // View options state
    const [isGridVisible, setIsGridVisible] = useState(true);
    const [isClassificationVisible, setIsClassificationVisible] = useState(false);

    const handleToggleGrid = () => {
        setIsGridVisible(prev => !prev);
    };
    
    const handleJsonNodeDrag = useCallback((id: string, delta: { dx: number; dy: number }) => {
        setUserNodes(prevNodes => {
            // If the dragged node is part of the selection, move all selected nodes
            if (selectedNodeIds.has(id)) {
                return prevNodes.map(node =>
                    selectedNodeIds.has(node.id)
                        ? { ...node, position: { x: node.position.x + delta.dx, y: node.position.y + delta.dy } }
                        : node
                );
            }
            // Fallback for single drag (shouldn't be strictly necessary with new logic but safe to keep)
            return prevNodes.map(node =>
                node.id === id
                    ? { ...node, position: { x: node.position.x + delta.dx, y: node.position.y + delta.dy } }
                    : node
            );
        });
    }, [selectedNodeIds]);

    const handleNodeDragStart = useCallback((id: string) => {
        if (!selectedNodeIds.has(id)) {
            setSelectedNodeIds(new Set([id]));
        }
    }, [selectedNodeIds]);

    const handleJSONDone = (contents: string[]) => {
        if (!rightPanelRef.current) return;
        
        const { width, height } = rightPanelRef.current.getBoundingClientRect();
        const markerWidth = 72; // BingoMarker width is 72px
        const padding = 20; // A small padding from the edges

        const newNodes = contents.map((content, index) => {
            // Calculate a random position within the panel's bounds, considering marker size and padding
            const x = padding + Math.random() * (width - markerWidth - (padding * 2));
            const y = padding + Math.random() * (height - markerWidth - (padding * 2));
            
            return {
                id: `node-${Date.now()}-${index}`,
                content,
                position: { x, y },
                order: index + 1,
            };
        });

        setUserNodes(newNodes);
        setIsModalOpen(false);
    };

    const handleBingoCellClick = (content: string) => {
        if (!rightPanelRef.current) return;

        const { width, height } = rightPanelRef.current.getBoundingClientRect();
        const markerWidth = 72; // BingoMarker width is 72px
        const padding = 20; // A small padding from the edges

        // Calculate a random position for the new node
        const x = padding + Math.random() * (width - markerWidth - (padding * 2));
        const y = padding + Math.random() * (height - markerWidth - (padding * 2));

        const newNode: NodeData = {
            id: `node-${Date.now()}-${Math.random()}`,
            content,
            position: { x, y },
        };

        setUserNodes(prevNodes => [...prevNodes, newNode]);
    };

    const handleMouseDownOnPanel = (e: React.MouseEvent<HTMLElement>) => {
        if ((e.target as HTMLElement).closest('.bingo-marker') || (e.target as HTMLElement).closest('.header-text') ||
        (e.target as HTMLElement).closest('.instructions')) {
            return;
        }

        e.preventDefault();
        const panelRect = rightPanelRef.current!.getBoundingClientRect();
        const startX = e.clientX - panelRect.left;
        const startY = e.clientY - panelRect.top;

        setSelectionBox({ x: startX, y: startY, width: 0, height: 0 });
        setSelectedNodeIds(new Set()); // Clear selection on new drag

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const currentX = moveEvent.clientX - panelRect.left;
            const currentY = moveEvent.clientY - panelRect.top;
            const x = Math.min(startX, currentX);
            const y = Math.min(startY, currentY);
            const width = Math.abs(currentX - startX);
            const height = Math.abs(currentY - startY);
            setSelectionBox({ x, y, width, height });
        };

        const handleMouseUp = (upEvent: MouseEvent) => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            setSelectionBox(prevBox => {
                if (prevBox && (prevBox.width > 0 || prevBox.height > 0)) {
                    const newSelectedIds = new Set<string>();
                    const markerWidth = 72;
                    userNodes.forEach(node => {
                        const nodeRect = {
                            left: node.position.x,
                            right: node.position.x + markerWidth,
                            top: node.position.y,
                            bottom: node.position.y + markerWidth,
                        };
                        const selectionRect = {
                            left: prevBox.x,
                            right: prevBox.x + prevBox.width,
                            top: prevBox.y,
                            bottom: prevBox.y + prevBox.height,
                        };
                        // Check for intersection
                        if (
                            nodeRect.left < selectionRect.right &&
                            nodeRect.right > selectionRect.left &&
                            nodeRect.top < selectionRect.bottom &&
                            nodeRect.bottom > selectionRect.top
                        ) {
                            newSelectedIds.add(node.id);
                        }
                    });
                    setSelectedNodeIds(newSelectedIds);
                }
                return null;
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };


    const handleGeneratePrompt = async () => {
        const selected = userNodes.filter(n => selectedNodeIds.has(n.id));
        const selectedContents = selected.map(n => n.content);
      
        if (selectedContents.length === 0) {
          alert("Please select at least one node first.");
          return;
        }
      
        //Start loading
        setIsGenerating(true);

        //Check with backend
        try {
          const response = await fetch(GENERATE_PROMPT_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedContents }),
          });
      
          if (!response.body) {
            console.error("No readable stream returned.");
            setIsGenerating(false);
            return;
          }
      
          // CLEAR previous content
          setModelResponse("");                
          setIsResponseBoxOpen(true);          // Open the DisplayBox immediately

          setIsGenerating(false);
      
          // Read stream token-by-token
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
      
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
      
            const chunk = decoder.decode(value, { stream: true });
      
            // Append tokens to box
            setModelResponse(prev => prev + chunk);
          }
        } catch (err) {
          console.error("Streaming failed:", err);
        } finally {
            setIsGenerating(false);   // Stop the loading
        }
    };
      
    const handleSavePrompt = (promptData: { title: string; description: string; tags: string[] }) => {
        const newPrompt: PromptData = {
            id: `prompt-${Date.now()}`,
            ...promptData,
        };
        setPrompts(currentPrompts => [newPrompt, ...currentPrompts]);
        setIsResponseBoxOpen(false); // Close modal on save
    };

    const handleDeletePrompt = (idToDelete: string) => {
        setPrompts(currentPrompts => currentPrompts.filter(prompt => prompt.id !== idToDelete));
    };


    // const handleClassifyNodes = () => {
    //     // If classification is already visible, just toggle it off
    //     if (isClassificationVisible) {
    //         setIsClassificationVisible(false);
    //         return;
    //     }

    //     // Check if the first node has a classification. If so, we've run this before.
    //     const alreadyClassified = userNodes.length > 0 && userNodes[0].classification;

    //     if (alreadyClassified) {
    //         // If already classified, just show the results.
    //         setIsClassificationVisible(true);
    //     } else {
    //         // Mock API call
    //         setIsGenerating(true);
    //         setTimeout(() => {
    //             const classifiedNodes = userNodes.map(node => {
    //                 // Mock logic: classify as 'unique' 50% of the time
    //                 // FIX: Explicitly type `classification` to match the `NodeData` interface.
    //                 // This prevents TypeScript from inferring it as a generic `string`.
    //                 const classification: 'unique' | 'irrelevant' = Math.random() > 0.5 ? 'unique' : 'irrelevant';
    //                 return { ...node, classification };
    //             });
    //             setUserNodes(classifiedNodes);
    //             setIsClassificationVisible(true);
    //             setIsGenerating(false);
    //         }, 1500); // Simulate 1.5 second network delay
    //     }
    // };

    const handleClassifyNodes = async () => {
        // 1. If bulbs are already showing → hide them and exit
        if (isClassificationVisible) {
            setIsClassificationVisible(false);
            return;
        }
    
        // 2. If nodes have been classified before, just show them again
        const alreadyClassified = userNodes.length > 0 && userNodes[0].classification;
        if (alreadyClassified) {
            setIsClassificationVisible(true);
            return;
        }
    
        // 3. Otherwise, this is the first time → call backend
        setIsGenerating(true);
    
        try {
            // Build the payload: only id + content
            const payload = {
                nodes: userNodes.map(n => ({ id: n.id, content: n.content }))
            };

            console.log("Sending to backend for classification:", payload); 
    
            const response = await fetch(CLASSIFY_NODES_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                console.error("Classification API error");
                setIsGenerating(false);
                return;
            }
    
            const result = await response.json(); 
            // result = [ { id: string, m: 1 or 0 }, ... ]
    
            // Merge classification into userNodes
            const updated = userNodes.map(node => {
                const match = result.find(r => r.id === node.id);
                if (!match) return node;
    
                // Convert integer → your string label
                const classification: "unique" | "irrelevant" = 
                    match.m === 1 ? "unique" : "irrelevant";
    
                return { ...node, classification };
            });
    
            setUserNodes(updated);
            setIsClassificationVisible(true);
    
        } catch (err) {
            console.error("Error calling classify-nodes:", err);
        }
    
        setIsGenerating(false);
    };

    if (view === 'history') {
        return <PromptHistoryPage onBack={() => setView('main')} prompts={prompts} onDelete={handleDeletePrompt} />;
    }
    

    return (
        <div className="app-container">
            {isModalOpen && <InputBox onDone={handleJSONDone} onClose={() => setIsModalOpen(false)} />}
            {isGenerating && <LoadingSpinner />}

            <DisplayBox 
            isOpen={isResponseBoxOpen} 
            content={modelResponse || "No optimized prompt returned from backend."} 
            onClose={() => {setIsResponseBoxOpen(false); setModelResponse(null);}}
            onSave={handleSavePrompt}
            />
            
            <div className="bingo-container" onMouseDown={handleMouseDownOnPanel}>
                <aside className="left-panel">
                    <header className="header-text">
                        <h1 className="title-bingo">Convo</h1>
                        <p className="subtitle-bingo">canvas for computer chat</p>
                        <div className="header-buttons">
                           <button className="app-button" onClick={() => setIsModalOpen(true)}>Add Chat</button>
                           {userNodes.length > 0 && (<>
                                <button className="app-button" onClick={() => {setUserNodes([]); setSelectedNodeIds(new Set());}}>Reset Flow</button>
                                <button className="app-button" onClick={handleGeneratePrompt}> Create Ideas</button>
                                </>)}
                                <button className="app-button" onClick={() => setView('history')}>View Log</button>
                        </div>
                    </header>
                    
                    <div className="token-area">
                        {circles.map((circle) => (
                            <BingoMarker
                                key={circle.id}
                                id={circle.id}
                                label={circle.label}
                                position={circle.position}
                                scale={1}
                                onDrag={handleBingoMarkerDrag}
                                onDragStart={() => {}}
                                onDragEnd={() => {}}
                            />
                        ))}
                    </div>
                    <footer className="instructions">
                        <p></p>
                    </footer>
                </aside>
                <main ref={rightPanelRef} className="right-panel">
                    {isGridVisible && (
                        <div className="bingo-grid">
                            {bingoItems.map((item, index) => (
                                <div key={index} className="bingo-cell" onClick={() => handleBingoCellClick(item)}>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {userNodes.length > 0 && (
                        <div className="node-canvas-container">
                            {userNodes.map((node) => (
                                <BingoMarker
                                    key={node.id}
                                    id={node.id}
                                    content={node.content}
                                    position={node.position}
                                    scale={1}
                                    isSelected={selectedNodeIds.has(node.id)}
                                    order={node.order}
                                    classification={node.classification}
                                    isClassificationVisible={isClassificationVisible}
                                    onDrag={handleJsonNodeDrag}
                                    onDragStart={() => handleNodeDragStart(node.id)}
                                    onDragEnd={() => {}}
                                />
                            ))}
                        </div>
                    )}
                    {selectionBox && <div className="selection-box" style={{ left: selectionBox.x, top: selectionBox.y, width: selectionBox.width, height: selectionBox.height }} />}
                </main>
            </div>
            <EditControls
                isGridVisible={isGridVisible}
                onToggleGrid={handleToggleGrid}
                isClassificationVisible={isClassificationVisible}
                onClassifyNodes={handleClassifyNodes}
            />
        </div>
    );
};

export default App;
