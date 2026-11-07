import React, { useState, useEffect } from 'react';

const LiveClassHeaderBar = ({
    classTitle = 'Computer Networks â€” Live Session',
    roomCode = 'CS-501',
    role = 'student',
    layoutMode = 'grid', // grid, spotlight
    isRecording = true,
    isAudioOnly = false,
    networkLatencyMs = 82,
    onToggleLayout,
    onToggleNetworkModal,
    onOpenInviteModal
}) => {
    const [elapsedSecs, setElapsedSecs] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSecs((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDuration = (secs) => {
        const hrs = Math.floor(secs / 3600);
        const mins = Math.floor((secs % 3600) / 60);
        const rem = secs % 60;
        const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
        return hrs > 0 ? `${pad(hrs)}:${pad(mins)}:${pad(rem)}` : `${pad(mins)}:${pad(rem)}`;
    };

    const latencyTone =
        networkLatencyMs > 300
            ? 'bg-red-500/20 text-red-300 border-red-500/30'
            : networkLatencyMs > 150
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

    return (
        <header className="bg-slate-900 border-b border-slate-700 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2 z-30">
            {/* Left: Class Title, Subject Code & Role Pill */}
            <div className="flex items-center gap-2 min-w-0">
                <span className="hidden sm:inline-flex text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-600/20 text-teal-300 border border-teal-500/30 shrink-0">
                    {roomCode}
                </span>

                <h1 className="text-xs sm:text-sm md:text-base font-bold text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                    {classTitle}
                </h1>

                <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                        role === 'teacher' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-200'
                    }`}
                >
                    {role === 'teacher' ? 'Faculty' : 'Student'}
                </span>
            </div>

            {/* Center: Timer & Recording Pulse */}
            <div className="hidden md:flex items-center gap-3">
                {isRecording && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-[11px] font-semibold text-red-300">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span>REC</span>
                    </div>
                )}

                <span className="text-xs font-mono font-bold text-slate-200 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
                    {formatDuration(elapsedSecs)}
                </span>

                {isAudioOnly && (
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Low-Data Audio Mode
                    </span>
                )}
            </div>

            {/* Right: Network Diagnostic, Invite & View Mode Switch */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                    type="button"
                    onClick={onToggleNetworkModal}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold transition ${latencyTone}`}
                    title="View live rural connection telemetry"
                >
                    {networkLatencyMs} ms
                </button>

                <button
                    type="button"
                    onClick={onToggleLayout}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] sm:text-xs font-semibold text-white transition"
                >
                    {layoutMode === 'grid' ? 'Spotlight View' : 'Grid View'}
                </button>

                {onOpenInviteModal && (
                    <button
                        type="button"
                        onClick={onOpenInviteModal}
                        className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-xs font-semibold text-white transition"
                    >
                        Invite
                    </button>
                )}
            </div>
        </header>
    );
};

export default LiveClassHeaderBar;