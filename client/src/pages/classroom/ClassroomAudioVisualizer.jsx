import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomAudioVisualizer = ({ isOpen, onClose, role }) => {
    const isTeacher = role === 'teacher';
    const [noiseGate, setNoiseGate] = useState(25);
    const [micSensitivity, setMicSensitivity] = useState(75);
    const [facultyPriority, setFacultyPriority] = useState(true);
    const [frequencies, setFrequencies] = useState([15, 30, 45, 60, 80, 50, 35, 20]);

    // Simulate audio spectrum frequencies
    useEffect(() => {
        if (!isOpen) return;
        const interval = setInterval(() => {
            setFrequencies(prev =>
                prev.map(() => Math.floor(Math.random() * 70) + 10)
            );
        }, 120);
        return () => clearInterval(interval);
    }, [isOpen]);

    const handleFacultyMuteAll = () => {
        toast.success('Priority audio enabled: All student mics muted for clean lecture audio.');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎙️</span>
                        <div>
                            <h2 className="text-base font-bold">Audio Spectrum & Noise Filter</h2>
                            <p className="text-xs text-gray-400">Rural acoustic calibration & fan noise dampening</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">✕</button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Real-time Spectrum Display */}
                    <div className="bg-gray-900 rounded-xl p-4 flex flex-col items-center justify-center space-y-2">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-teal-400">Microphone Input Spectrum</span>
                        <div className="flex items-end justify-center gap-2 h-20 w-full px-4">
                            {frequencies.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-gradient-to-t from-teal-500 via-emerald-400 to-amber-300 rounded-t-sm transition-all duration-100"
                                    style={{ height: `${Math.max(8, h)}%` }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between w-full text-[10px] text-gray-400 font-mono px-2">
                            <span>100Hz (Bass)</span>
                            <span>1kHz (Speech)</span>
                            <span>8kHz (Treble)</span>
                        </div>
                    </div>

                    {/* Noise Gate Calibration */}
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div>
                            <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                                <span>Background Noise Gate Threshold</span>
                                <span className="font-mono text-teal-600">{noiseGate}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                value={noiseGate}
                                onChange={(e) => setNoiseGate(Number(e.target.value))}
                                className="w-full accent-teal-600 cursor-pointer"
                            />
                            <p className="text-[10px] text-gray-500 mt-1">
                                Cuts out low rumble from rural ceiling fans, desert coolers, and street traffic.
                            </p>
                        </div>

                        <div>
                            <div className="flex justify-between text-xs text-gray-700 font-semibold mb-1">
                                <span>Mic Sensitivity Boost</span>
                                <span className="font-mono text-teal-600">{micSensitivity}%</span>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                value={micSensitivity}
                                onChange={(e) => setMicSensitivity(Number(e.target.value))}
                                className="w-full accent-teal-600 cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Teacher Priority Toggle */}
                    {isTeacher && (
                        <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-teal-900 block">Faculty Voice Priority</span>
                                <span className="text-[11px] text-teal-700">Auto-attenuate student speech when teacher speaks</span>
                            </div>
                            <button
                                onClick={handleFacultyMuteAll}
                                className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                            >
                                Mute All Students
                            </button>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-2 pt-2 border-t">
                        <button
                            onClick={() => {
                                toast.success('Acoustic profile calibrated successfully!');
                                onClose();
                            }}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-xl transition shadow"
                        >
                            Apply Audio Settings
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2.5 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomAudioVisualizer;
