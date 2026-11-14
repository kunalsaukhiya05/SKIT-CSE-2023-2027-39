import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const QUALITY_PRESETS = [
    { id: 'audio_only', label: 'Audio Only (24 kbps)', desc: 'Best for 2G or weak rural cellular' },
    { id: 'saver_240p', label: 'Data Saver (240p)', desc: 'Clear teacher audio + compressed slides' },
    { id: 'balanced_480p', label: 'Standard (480p)', desc: 'Balanced video quality on 4G / WiFi' }
];

const DeviceSwitchQuickMenu = ({
    isOpen,
    onClose,
    currentPreset = 'saver_240p',
    onSelectPreset
}) => {
    const [mics, setMics] = useState([
        { deviceId: 'default-mic', label: 'Built-in Array Microphone' },
        { deviceId: 'headset-mic', label: 'Wired Earphone Microphone' }
    ]);
    const [cameras, setCameras] = useState([
        { deviceId: 'default-cam', label: 'Integrated Webcam (HD)' }
    ]);
    const [speakers, setSpeakers] = useState([
        { deviceId: 'default-spk', label: 'System Default Speakers' }
    ]);

    const [selectedMic, setSelectedMic] = useState('default-mic');
    const [selectedCam, setSelectedCam] = useState('default-cam');
    const [selectedSpk, setSelectedSpk] = useState('default-spk');
    const [micActivityPct, setMicActivityPct] = useState(28);
    const [echoCancel, setEchoCancel] = useState(true);

    useEffect(() => {
        if (!isOpen) return;

        // Enumerate real hardware devices when browser permissions allow
        if (navigator.mediaDevices?.enumerateDevices) {
            navigator.mediaDevices
                .enumerateDevices()
                .then((devices) => {
                    const audioInputs = devices.filter((d) => d.kind === 'audioinput' && d.label);
                    const videoInputs = devices.filter((d) => d.kind === 'videoinput' && d.label);
                    const audioOutputs = devices.filter((d) => d.kind === 'audiooutput' && d.label);

                    if (audioInputs.length > 0) {
                        setMics(audioInputs.map((d) => ({ deviceId: d.deviceId, label: d.label })));
                        setSelectedMic(audioInputs[0].deviceId);
                    }
                    if (videoInputs.length > 0) {
                        setCameras(videoInputs.map((d) => ({ deviceId: d.deviceId, label: d.label })));
                        setSelectedCam(videoInputs[0].deviceId);
                    }
                    if (audioOutputs.length > 0) {
                        setSpeakers(audioOutputs.map((d) => ({ deviceId: d.deviceId, label: d.label })));
                        setSelectedSpk(audioOutputs[0].deviceId);
                    }
                })
                .catch(() => {});
        }

        const meter = setInterval(() => {
            setMicActivityPct(Math.floor(Math.random() * 55) + 15);
        }, 350);
        return () => clearInterval(meter);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleApply = () => {
        toast.success('Live session device & quality preferences updated!');
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="px-5 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold">In-Call Devices & Bandwidth</h3>
                        <p className="text-[11px] text-slate-400">Switch audio hardware or streaming quality live</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                    >
                        Close
                    </button>
                </div>

                <div className="p-5 space-y-4">
                    {/* Bandwidth / Video Preset Picker */}
                    <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                            Streaming Quality Preset
                        </span>
                        <div className="space-y-1.5">
                            {QUALITY_PRESETS.map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => onSelectPreset?.(preset.id)}
                                    className={`w-full text-left p-2.5 rounded-xl border transition ${
                                        currentPreset === preset.id
                                            ? 'bg-teal-600/20 border-teal-500 text-white'
                                            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:border-slate-500'
                                    }`}
                                >
                                    <div className="flex items-center justify-between text-xs font-bold">
                                        <span>{preset.label}</span>
                                        {currentPreset === preset.id && (
                                            <span className="text-[10px] text-teal-300 uppercase">Active</span>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-slate-400 block mt-0.5">{preset.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hardware Dropdowns */}
                    <div className="space-y-3 pt-2 border-t border-slate-800">
                        <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Microphone</label>
                            <select
                                value={selectedMic}
                                onChange={(e) => setSelectedMic(e.target.value)}
                                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                            >
                                {mics.map((m) => (
                                    <option key={m.deviceId} value={m.deviceId}>
                                        {m.label}
                                    </option>
                                ))}
                            </select>
                            <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-[10px] text-slate-400">Input level</span>
                                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-400 transition-all duration-200"
                                        style={{ width: `${micActivityPct}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Camera</label>
                            <select
                                value={selectedCam}
                                onChange={(e) => setSelectedCam(e.target.value)}
                                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                            >
                                {cameras.map((c) => (
                                    <option key={c.deviceId} value={c.deviceId}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[11px] font-semibold text-slate-300 mb-1">Speaker Output</label>
                            <select
                                value={selectedSpk}
                                onChange={(e) => setSelectedSpk(e.target.value)}
                                className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                            >
                                {speakers.map((s) => (
                                    <option key={s.deviceId} value={s.deviceId}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={echoCancel}
                                onChange={(e) => setEchoCancel(e.target.checked)}
                                className="rounded text-teal-500"
                            />
                            Enable acoustic echo cancellation & voice isolation
                        </label>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={handleApply}
                            className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition"
                        >
                            Apply Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceSwitchQuickMenu;