import React, { useState, useEffect } from 'react';

const LowBandwidthAudioMode = ({ activeSpeaker, onSwitchToVideo, participants = [] }) => {
    const [bitrateKbps, setBitrateKbps] = useState(32);
    const [savedMB, setSavedMB] = useState(142);
    const [waveformHeights, setWaveformHeights] = useState([20, 35, 60, 45, 80, 55, 30, 20]);

    // Animate audio waveform bars to simulate live speech
    useEffect(() => {
        const interval = setInterval(() => {
            setWaveformHeights(prev =>
                prev.map(() => Math.floor(Math.random() * 65) + 15)
            );
        }, 180);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-full min-h-[480px] bg-gradient-to-b from-gray-900 via-slate-900 to-gray-950 flex flex-col justify-between p-6 text-white select-none">
            {/* Top Bar: Bandwidth Savings Telemetry */}
            <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-gray-700 shadow-md">
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold tracking-wide text-emerald-400 uppercase">Rural Low-Bandwidth Audio Mode</span>
                    <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">2G / 3G Saver Active</span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="flex items-center gap-1 text-gray-300">
                        <span className="text-gray-400">Stream:</span>
                        <span className="text-teal-400 font-bold">{bitrateKbps} kbps</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                        <span className="text-gray-400">Data Saved:</span>
                        <span className="text-amber-400 font-bold">~{savedMB} MB</span>
                    </div>
                </div>
            </div>

            {/* Center: Active Speaker Profile & Audio Waveform */}
            <div className="flex flex-col items-center justify-center my-auto space-y-4">
                {/* Speaker Avatar with Pulsing Rings */}
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-36 h-36 rounded-full bg-teal-500/20 animate-ping"></div>
                    <div className="absolute w-32 h-32 rounded-full bg-teal-500/30"></div>
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-teal-300 z-10">
                        {activeSpeaker?.name ? activeSpeaker.name.charAt(0) : 'T'}
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-gray-100">{activeSpeaker?.name || 'Prof. Ramesh Sharma'}</h3>
                    <p className="text-xs text-teal-400 font-medium">Currently Speaking • Mic Active</p>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1.5 h-16 pt-2">
                    {waveformHeights.map((h, i) => (
                        <div
                            key={i}
                            className="w-1.5 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-full transition-all duration-150"
                            style={{ height: `${h}px` }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Bar: Participants strip & Switch to Video Toggle */}
            <div className="flex items-center justify-between bg-gray-800/60 backdrop-blur-md px-4 py-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-2 overflow-x-auto max-w-md">
                    <span className="text-xs text-gray-400 mr-1">In Audio ({participants.length || 7}):</span>
                    {(participants.length > 0 ? participants : [
                        'Aarav', 'Divya', 'Hemant', 'Bhavna', 'Chetan', 'Kavita', 'Neha'
                    ]).map((name, i) => (
                        <div
                            key={i}
                            className="text-xs bg-gray-700/80 px-2.5 py-1 rounded-full text-gray-300 font-medium flex items-center gap-1"
                        >
                            <span className="text-[10px]">🎙️</span>
                            <span>{name}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onSwitchToVideo}
                    className="text-xs bg-teal-600 hover:bg-teal-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition flex items-center gap-1.5"
                >
                    <span>🎥</span>
                    <span>Switch to HD Video</span>
                </button>
            </div>
        </div>
    );
};

export default LowBandwidthAudioMode;
