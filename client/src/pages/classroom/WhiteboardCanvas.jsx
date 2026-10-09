import React, { useRef, useState, useEffect, useCallback } from 'react';

const WhiteboardCanvas = ({ isOpen, onClose, role }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState('pen'); // pen, highlighter, eraser, rect, circle, line
    const [color, setColor] = useState('#1e293b');
    const [lineWidth, setLineWidth] = useState(3);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const snapshotRef = useRef(null);

    const colors = ['#1e293b', '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

    // Initialize Canvas
    useEffect(() => {
        if (!isOpen) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        canvas.width = parent.clientWidth * 2;
        canvas.height = parent.clientHeight * 2;
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;

        const ctx = canvas.getContext('2d');
        ctx.scale(2, 2);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        contextRef.current = ctx;

        // Fill white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, parent.clientWidth, parent.clientHeight);

        saveSnapshot();
    }, [isOpen]);

    const saveSnapshot = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL();
        setHistory((prev) => {
            const newHistory = prev.slice(0, historyStep + 1);
            return [...newHistory, dataUrl];
        });
        setHistoryStep((prev) => prev + 1);
    }, [historyStep]);

    const handleUndo = () => {
        if (historyStep <= 0) return;
        const newStep = historyStep - 1;
        restoreStep(newStep);
    };

    const handleRedo = () => {
        if (historyStep >= history.length - 1) return;
        const newStep = historyStep + 1;
        restoreStep(newStep);
    };

    const restoreStep = (step) => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        const img = new Image();
        img.src = history[step];
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
            setHistoryStep(step);
        };
    };

    const clearBoard = () => {
        if (!window.confirm('Are you sure you want to clear the whiteboard?')) return;
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
        saveSnapshot();
    };

    const exportImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `whiteboard-notes-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    // Drawing handlers
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const ctx = contextRef.current;

        ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
        ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : tool === 'highlighter' ? lineWidth * 3 : lineWidth;
        ctx.globalAlpha = tool === 'highlighter' ? 0.35 : 1.0;

        if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
        } else {
            // Save state for shape preview
            snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            setStartPos({ x: offsetX, y: offsetY });
        }

        setIsDrawing(true);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const ctx = contextRef.current;

        if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
        } else if (snapshotRef.current) {
            // Restore snapshot for live shape preview
            ctx.putImageData(snapshotRef.current, 0, 0);
            ctx.beginPath();
            if (tool === 'rect') {
                ctx.strokeRect(startPos.x, startPos.y, offsetX - startPos.x, offsetY - startPos.y);
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(offsetX - startPos.x, 2) + Math.pow(offsetY - startPos.y, 2));
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (tool === 'line') {
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const ctx = contextRef.current;
        ctx.closePath();
        ctx.globalAlpha = 1.0;
        setIsDrawing(false);
        saveSnapshot();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex flex-col backdrop-blur-sm">
            {/* Toolbar Header */}
            <div className="bg-gray-800 text-white px-4 py-2.5 flex items-center justify-between shadow-md border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <span className="text-teal-400 font-bold flex items-center gap-1.5 text-sm md:text-base">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Rural Classroom Whiteboard
                    </span>
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300">
                        {role === 'teacher' ? 'Teacher Mode (Broadcast)' : 'Student Scratchpad'}
                    </span>
                </div>

                {/* Tool Selection */}
                <div className="flex items-center gap-1.5 bg-gray-700 p-1 rounded-lg">
                    <button onClick={() => setTool('pen')} title="Pen" className={`p-1.5 rounded ${tool === 'pen' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        ✏️
                    </button>
                    <button onClick={() => setTool('highlighter')} title="Highlighter" className={`p-1.5 rounded ${tool === 'highlighter' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        🖍️
                    </button>
                    <button onClick={() => setTool('eraser')} title="Eraser" className={`p-1.5 rounded ${tool === 'eraser' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        🧹
                    </button>
                    <button onClick={() => setTool('rect')} title="Rectangle" className={`p-1.5 rounded ${tool === 'rect' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        ▭
                    </button>
                    <button onClick={() => setTool('circle')} title="Circle" className={`p-1.5 rounded ${tool === 'circle' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        ◯
                    </button>
                    <button onClick={() => setTool('line')} title="Line" className={`p-1.5 rounded ${tool === 'line' ? 'bg-teal-600 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                        ╱
                    </button>
                </div>

                {/* Color Palette */}
                <div className="hidden md:flex items-center gap-1.5">
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => setColor(c)}
                            className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-white shadow' : 'border-transparent'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                    <div className="ml-2 flex items-center gap-1 text-xs text-gray-400">
                        <span>Size:</span>
                        <input
                            type="range"
                            min="1"
                            max="12"
                            value={lineWidth}
                            onChange={(e) => setLineWidth(Number(e.target.value))}
                            className="w-16 accent-teal-500"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={handleUndo} disabled={historyStep <= 0} title="Undo" className="p-1.5 text-gray-300 hover:bg-gray-700 rounded disabled:opacity-40">
                        ↩
                    </button>
                    <button onClick={handleRedo} disabled={historyStep >= history.length - 1} title="Redo" className="p-1.5 text-gray-300 hover:bg-gray-700 rounded disabled:opacity-40">
                        ↪
                    </button>
                    <button onClick={clearBoard} title="Clear Board" className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded font-medium">
                        Clear
                    </button>
                    <button onClick={exportImage} title="Export PNG" className="px-2.5 py-1 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded font-medium">
                        Save PNG
                    </button>
                    <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white rounded ml-2">
                        ✕
                    </button>
                </div>
            </div>

            {/* Canvas Body */}
            <div className="flex-1 relative bg-white overflow-hidden cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );
};

export default WhiteboardCanvas;
