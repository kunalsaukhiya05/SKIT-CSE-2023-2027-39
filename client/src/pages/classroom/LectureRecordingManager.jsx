import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const LectureRecordingManager = ({ isOpen, onClose, classTitle }) => {
    const [recordingStatus, setRecordingStatus] = useState('idle'); // idle, recording, paused
    const [seconds, setSeconds] = useState(0);
    const [resolution, setResolution] = useState('480p'); // 360p, 480p, 720p
    const [autoCompress, setAutoCompress] = useState(true);

    const [recordedFiles, setRecordedFiles] = useState([
        { id: 1, name: 'Unit-3-Part-1-Routing.mp4', duration: '45m 12s', size: '64 MB', date: 'Oct 14, 2026' },
        { id: 2, name: 'Unit-3-Part-2-TCP-Window.mp4', duration: '50m 30s', size: '72 MB', date: 'Oct 16, 2026' }
    ]);

    // Timer
    useEffect(() => {
        if (recordingStatus !== 'recording') return;
        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [recordingStatus]);

    const formatTime = (totalSecs) => {
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        return `${hrs > 0 ? hrs + ':' : ''}${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Calculate approximate size based on resolution
    const estimatedMB = Math.max(1, Math.round((seconds * (resolution === '360p' ? 0.08 : resolution === '480p' ? 0.15 : 0.35))));

    const startRecording = () => {
        setRecordingStatus('recording');
        toast.success('Local recording started.');
    };

    const pauseRecording = () => {
        setRecordingStatus('paused');
        toast('Recording paused.', { icon: '⏸️' });
    };

    const resumeRecording = () => {
        setRecordingStatus('recording');
        toast.success('Recording resumed.');
    };

    const stopRecording = () => {
        const newFile = {
            id: Date.now(),
            name: `${classTitle || 'Lecture'}-Rec-${new Date().toISOString().slice(0, 10)}.mp4`,
            duration: formatTime(seconds),
            size: `${estimatedMB} MB`,
            date: 'Today'
        };
        setRecordedFiles([newFile, ...recordedFiles]);
        setRecordingStatus('idle');
        setSeconds(0);
        toast.success('Recording saved locally! Ready for compression.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">📹</span>
                        <div>
                            <h2 className="text-base font-bold">Lecture Recording Manager</h2>
                            <p className="text-xs text-gray-400">Local capture with rural upload optimization</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Active Recording State Card */}
                    <div className="bg-gray-900 text-white rounded-xl p-5 flex flex-col items-center justify-center space-y-3">
                        <div className="flex items-center gap-2">
                            {recordingStatus === 'recording' && (
                                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                            )}
                            <span className="text-xs font-mono uppercase tracking-wider text-gray-300">
                                {recordingStatus === 'recording' ? 'Recording in progress' : recordingStatus === 'paused' ? 'Recording paused' : 'Standby'}
                            </span>
                        </div>

                        <div className="text-3xl font-mono font-bold text-white tracking-widest">
                            {formatTime(seconds)}
                        </div>

                        <div className="text-xs text-gray-400 flex items-center gap-3">
                            <span>Resolution: <b className="text-teal-400">{resolution}</b></span>
                            <span>•</span>
                            <span>Est. Size: <b className="text-amber-400">~{estimatedMB} MB</b></span>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2 pt-2">
                            {recordingStatus === 'idle' ? (
                                <button
                                    onClick={startRecording}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow"
                                >
                                    <span>⏺</span>
                                    <span>Start Recording</span>
                                </button>
                            ) : (
                                <>
                                    {recordingStatus === 'recording' ? (
                                        <button
                                            onClick={pauseRecording}
                                            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                                        >
                                            Pause
                                        </button>
                                    ) : (
                                        <button
                                            onClick={resumeRecording}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                                        >
                                            Resume
                                        </button>
                                    )}
                                    <button
                                        onClick={stopRecording}
                                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-semibold px-4 py-2 rounded-lg"
                                    >
                                        Stop & Save
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rural Quality Preset</label>
                            <select
                                value={resolution}
                                onChange={(e) => setResolution(e.target.value)}
                                disabled={recordingStatus !== 'idle'}
                                className="w-full text-xs border border-gray-300 rounded-lg p-2 bg-white"
                            >
                                <option value="360p">360p (Ultra Low Data: ~5 MB/10m)</option>
                                <option value="480p">480p (Standard Rural: ~10 MB/10m)</option>
                                <option value="720p">720p (HD Quality: ~25 MB/10m)</option>
                            </select>
                        </div>
                        <div className="flex items-center pt-4">
                            <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={autoCompress}
                                    onChange={(e) => setAutoCompress(e.target.checked)}
                                    className="rounded text-teal-600 focus:ring-teal-500"
                                />
                                Auto-compress before upload
                            </label>
                        </div>
                    </div>

                    {/* Previous Recordings */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">Saved Class Recordings</h4>
                        <div className="space-y-2 max-h-36 overflow-y-auto">
                            {recordedFiles.map((f) => (
                                <div key={f.id} className="p-2.5 rounded-lg border border-gray-200 bg-white flex items-center justify-between text-xs">
                                    <div>
                                        <span className="font-semibold text-gray-800 block truncate max-w-[200px]">{f.name}</span>
                                        <span className="text-[10px] text-gray-400">{f.duration} • {f.size} • {f.date}</span>
                                    </div>
                                    <button
                                        onClick={() => toast.success(`Preparing download for ${f.name}`)}
                                        className="text-teal-600 hover:text-teal-800 font-semibold"
                                    >
                                        ⬇ Download
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LectureRecordingManager;
