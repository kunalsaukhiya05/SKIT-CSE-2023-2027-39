import React, { useState, useEffect } from 'react';

const RecordingIndicator = ({ isRecording, onStopRecording, isTeacher, startTime }) => {
    const [elapsed, setElapsed] = useState('00:00');

    useEffect(() => {
        if (!isRecording || !startTime) return;
        const interval = setInterval(() => {
            const diff = Math.floor((Date.now() - new Date(startTime).getTime()) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            setElapsed(mins + ':' + secs);
        }, 1000);
        return () => clearInterval(interval);
    }, [isRecording, startTime]);

    if (!isRecording) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <div className="bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <span className="text-sm font-semibold">Recording</span>
                <span className="text-sm font-mono bg-red-700 px-2 py-0.5 rounded">{elapsed}</span>
                {isTeacher && (
                    <button onClick={onStopRecording} className="ml-2 px-3 py-1 bg-white text-red-600 rounded-full text-xs font-bold hover:bg-red-50 transition-colors">Stop</button>
                )}
            </div>
        </div>
    );
};

export default RecordingIndicator;
