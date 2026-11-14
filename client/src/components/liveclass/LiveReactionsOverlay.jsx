import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const PULSE_SIGNALS = [
    { id: 'understood', label: 'Concept Clear', short: 'Clear', badgeClass: 'bg-emerald-600/90 hover:bg-emerald-500 text-white' },
    { id: 'repeat', label: 'Repeat Step', short: 'Repeat', badgeClass: 'bg-amber-600/90 hover:bg-amber-500 text-white' },
    { id: 'slow', label: 'Slow Down', short: 'Slower', badgeClass: 'bg-sky-600/90 hover:bg-sky-500 text-white' },
    { id: 'audio_issue', label: 'Audio Unclear', short: 'Audio Lag', badgeClass: 'bg-red-600/90 hover:bg-red-500 text-white' }
];

const QUICK_REACTIONS = [
    { id: 'clap', label: 'Clap', symbol: '+1' },
    { id: 'thumbs', label: 'Agree', symbol: 'OK' },
    { id: 'bulb', label: 'Aha!', symbol: 'Idea' },
    { id: 'question', label: 'Doubt', symbol: '?' }
];

const LiveReactionsOverlay = ({
    isOpen,
    onClose,
    userName = 'Student',
    reducedMotion = false,
    onSendPulse
}) => {
    const [feed, setFeed] = useState([
        { id: 1, sender: 'Divya Soni', label: 'Concept Clear', type: 'understood', timestamp: '10:12 AM' },
        { id: 2, sender: 'Hemant Choudhary', label: 'Repeat Step', type: 'repeat', timestamp: '10:14 AM' }
    ]);

    const [counts, setCounts] = useState({
        understood: 14,
        repeat: 4,
        slow: 2,
        audio_issue: 1
    });

    const [floatingBadges, setFloatingBadges] = useState([]);

    useEffect(() => {
        if (floatingBadges.length === 0) return;
        const timer = setTimeout(() => {
            setFloatingBadges((prev) => prev.slice(1));
        }, 2200);
        return () => clearTimeout(timer);
    }, [floatingBadges]);

    const triggerSignal = (signal) => {
        const entry = {
            id: Date.now(),
            sender: userName,
            label: signal.label,
            type: signal.id,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setFeed((prev) => [entry, ...prev].slice(0, 8));
        if (counts[signal.id] !== undefined) {
            setCounts((prev) => ({ ...prev, [signal.id]: prev[signal.id] + 1 }));
        }

        if (!reducedMotion) {
            setFloatingBadges((prev) => [...prev, { id: entry.id, label: `${userName}: ${signal.label}` }]);
        }

        onSendPulse?.(entry);
        toast.success(`Sent "${signal.label}" to live classroom`);
    };

    const totalResponses = counts.understood + counts.repeat + counts.slow + counts.audio_issue;

    return (
        <>
            {/* Transient Non-Blocking Floating Stream */}
            {floatingBadges.length > 0 && (
                <div className="pointer-events-none fixed bottom-24 left-4 sm:left-8 z-40 flex flex-col gap-1.5">
                    {floatingBadges.map((item) => (
                        <div
                            key={item.id}
                            className="bg-slate-900/90 border border-teal-500/40 text-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg animate-bounce"
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}

            {/* Interactive Pulse & Reactions Tray */}
            {isOpen && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-md bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-xs sm:text-sm font-bold text-white">Live Comprehension & Reactions</h3>
                            <p className="text-[11px] text-slate-400">Lightweight classroom signals for low-end devices</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-xs px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200"
                        >
                            Close
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Quick Reactions Row */}
                        <div className="grid grid-cols-4 gap-2">
                            {QUICK_REACTIONS.map((rx) => (
                                <button
                                    key={rx.id}
                                    type="button"
                                    onClick={() => triggerSignal(rx)}
                                    className="py-2 rounded-xl bg-slate-800 hover:bg-teal-600/30 border border-slate-700 hover:border-teal-500 text-center transition"
                                >
                                    <span className="text-xs font-bold text-teal-300 block">{rx.symbol}</span>
                                    <span className="text-[11px] text-slate-300">{rx.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Structured Comprehension Pulse Controls */}
                        <div className="space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                Lecture Pace Feedback ({totalResponses} Total)
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {PULSE_SIGNALS.map((sig) => (
                                    <button
                                        key={sig.id}
                                        type="button"
                                        onClick={() => triggerSignal(sig)}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${sig.badgeClass}`}
                                    >
                                        <span>{sig.label}</span>
                                        <span className="bg-black/25 px-1.5 py-0.5 rounded-full text-[10px]">
                                            {counts[sig.id]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Classroom Activity Feed */}
                        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 max-h-28 overflow-y-auto">
                            {feed.map((item) => (
                                <div key={item.id} className="flex items-center justify-between text-[11px] text-slate-300">
                                    <span className="truncate">
                                        <b className="text-white">{item.sender}</b> signaled {item.label}
                                    </span>
                                    <span className="text-slate-500 ml-2 shrink-0">{item.timestamp}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default LiveReactionsOverlay;