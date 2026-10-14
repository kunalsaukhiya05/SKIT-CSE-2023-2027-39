import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const MediaSettingsModal = ({ isOpen, onClose }) => {
    const [cameras, setCameras] = useState(['Default Web Camera', 'USB 2.0 HD Camera']);
    const [microphones, setMicrophones] = useState(['Default Audio Microphone', 'Headset Mic (Realtek)']);
    const [speakers, setSpeakers] = useState(['Default Stereo Speakers', 'Realtek Audio Output']);

    const [selectedCamera, setSelectedCamera] = useState('Default Web Camera');
    const [selectedMic, setSelectedMic] = useState('Default Audio Microphone');
    const [selectedSpeaker, setSelectedSpeaker] = useState('Default Stereo Speakers');

    const [isLowBandwidthMode, setIsLowBandwidthMode] = useState(false);
    const [isNoiseSuppression, setIsNoiseSuppression] = useState(true);
    const [isEchoCancellation, setIsEchoCancellation] = useState(true);

    const [testVolume, setTestVolume] = useState(35);

    // Audio test tone generator using Web Audio API
    const playTestTone = () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, ctx.currentTime); // 440 Hz standard A tone
            gain.gain.setValueAtTime(0.15, ctx.currentTime);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
            toast.success('Playing speaker test sound...');
        } catch (err) {
            toast('Audio preview ready');
        }
    };

    const handleSave = () => {
        toast.success('Media device preferences applied!');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">⚙️</span>
                        <div>
                            <h2 className="text-base font-bold">Audio & Video Settings</h2>
                            <p className="text-xs text-gray-400">Configure peripherals for rural low-bandwidth network</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Camera Select */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Camera Device</label>
                        <select
                            value={selectedCamera}
                            onChange={(e) => setSelectedCamera(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                        >
                            {cameras.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Microphone Select */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Microphone Device</label>
                        <select
                            value={selectedMic}
                            onChange={(e) => setSelectedMic(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                        >
                            {microphones.map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>

                        {/* Mic Volume Level Bar */}
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-[11px] text-gray-500">Mic Level:</span>
                            <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal-500 h-full transition-all duration-300" style={{ width: `${testVolume}%` }} />
                            </div>
                            <span className="text-[11px] font-mono text-gray-600">{testVolume}%</span>
                        </div>
                    </div>

                    {/* Speaker Select */}
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-semibold text-gray-700">Audio Output (Speaker)</label>
                            <button
                                type="button"
                                onClick={playTestTone}
                                className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
                            >
                                🔊 Test Speaker
                            </button>
                        </div>
                        <select
                            value={selectedSpeaker}
                            onChange={(e) => setSelectedSpeaker(e.target.value)}
                            className="w-full text-xs border border-gray-300 rounded-lg p-2.5 bg-white"
                        >
                            {speakers.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                    </div>

                    {/* Network & Optimization Toggles */}
                    <div className="pt-3 border-t space-y-3">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isLowBandwidthMode}
                                onChange={(e) => setIsLowBandwidthMode(e.target.checked)}
                                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                            />
                            <div>
                                <span className="text-xs font-bold text-gray-800 block">Low Bandwidth Saver Mode (Recommended for 2G/3G)</span>
                                <span className="text-[11px] text-gray-500 leading-tight block">
                                    Caps video stream to 360p / 15 FPS to prevent freezing during audio discussions.
                                </span>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isNoiseSuppression}
                                onChange={(e) => setIsNoiseSuppression(e.target.checked)}
                                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                            />
                            <div>
                                <span className="text-xs font-bold text-gray-800 block">AI Background Noise Suppression</span>
                                <span className="text-[11px] text-gray-500 leading-tight block">
                                    Filters ambient village background noise such as traffic and fan buzz.
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-3 border-t">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold py-2.5 rounded-xl shadow-md transition"
                        >
                            Apply Settings
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

export default MediaSettingsModal;
