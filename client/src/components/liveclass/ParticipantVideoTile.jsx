import React, { useState } from 'react';

const AVATAR_PALETTES = [
    'from-teal-600 to-emerald-500',
    'from-sky-600 to-cyan-500',
    'from-indigo-600 to-blue-500',
    'from-amber-600 to-orange-500',
    'from-rose-600 to-pink-500'
];

const getAvatarGradient = (name = '') => {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
};

const getInitials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ParticipantVideoTile = ({
    participant,
    isTeacherView = false,
    isPinned = false,
    compact = false,
    onPinToggle,
    onMuteToggle,
    onInspectParticipant
}) => {
    const [showActions, setShowActions] = useState(false);

    const {
        id,
        name = 'Student',
        role = 'student',
        isSpeaking = false,
        isMuted = true,
        isVideoOn = false,
        handRaised = false,
        audioOnly = false,
        signalStrength = 4 // 1 to 4 bars
    } = participant || {};

    const gradientClass = getAvatarGradient(name);

    return (
        <div
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
            className={`relative rounded-xl overflow-hidden bg-slate-900 border-2 transition-all duration-200 select-none flex flex-col justify-between ${
                compact ? 'min-h-[110px]' : 'min-h-[175px] sm:min-h-[205px]'
            } ${
                isSpeaking
                    ? 'border-emerald-400 shadow-[0_0_0_2px_rgba(52,211,153,0.35)]'
                    : isPinned
                    ? 'border-teal-500'
                    : 'border-slate-700 hover:border-slate-500'
            }`}
        >
            {/* Top Status Row */}
            <div className="flex items-center justify-between px-2.5 pt-2 z-10">
                <div className="flex items-center gap-1.5">
                    {role === 'teacher' && (
                        <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-teal-600 text-white">
                            Host
                        </span>
                    )}
                    {isPinned && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/90 text-teal-300 border border-teal-500/40">
                            Pinned
                        </span>
                    )}
                    {audioOnly && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Audio Saver
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5">
                    {handRaised && (
                        <span
                            title="Hand Raised"
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse"
                        >
                            Hand Raised
                        </span>
                    )}

                    {/* Signal Quality Bars */}
                    <div
                        className="flex items-end gap-0.5 h-3.5 px-1.5 py-0.5 rounded bg-slate-800/80"
                        title={`Signal strength: ${signalStrength}/4`}
                    >
                        {[1, 2, 3, 4].map((bar) => (
                            <span
                                key={bar}
                                className={`w-1 rounded-sm ${
                                    bar <= signalStrength
                                        ? signalStrength <= 1
                                            ? 'bg-red-400'
                                            : signalStrength === 2
                                            ? 'bg-amber-400'
                                            : 'bg-emerald-400'
                                        : 'bg-slate-600'
                                }`}
                                style={{ height: `${bar * 25}%` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Center Video Frame or Low-Bandwidth Avatar Fallback */}
            <div className="flex-1 flex flex-col items-center justify-center p-3">
                {isVideoOn && !audioOnly ? (
                    <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border border-slate-700/70 flex flex-col items-center justify-center gap-2 p-3">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white text-lg sm:text-xl font-bold shadow-lg`}>
                            {getInitials(name)}
                        </div>
                        <span className="text-[10px] text-emerald-300 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Live Video Feed
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-1.5">
                        <div
                            className={`${
                                compact ? 'w-11 h-11 text-sm' : 'w-16 h-16 text-xl'
                            } rounded-full bg-gradient-to-tr ${gradientClass} flex items-center justify-center text-white font-bold shadow-md ${
                                isSpeaking ? 'ring-4 ring-emerald-400/40' : ''
                            }`}
                        >
                            {getInitials(name)}
                        </div>
                        {!compact && (
                            <span className="text-[11px] text-slate-400">
                                {audioOnly ? '2G/3G Audio Mode' : 'Camera Off'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Hover Action Overlay */}
            {showActions && (
                <div className="absolute inset-x-2 bottom-9 flex items-center justify-center gap-1.5 z-20">
                    <button
                        type="button"
                        onClick={() => onPinToggle?.(id)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/95 hover:bg-teal-600 text-white border border-slate-600 transition shadow"
                    >
                        {isPinned ? 'Unpin' : 'Pin'}
                    </button>
                    {isTeacherView && role !== 'teacher' && (
                        <button
                            type="button"
                            onClick={() => onMuteToggle?.(id)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/95 hover:bg-amber-600 text-white border border-slate-600 transition shadow"
                        >
                            {isMuted ? 'Request Unmute' : 'Mute'}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => onInspectParticipant?.(participant)}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-800/95 hover:bg-slate-700 text-white border border-slate-600 transition shadow"
                    >
                        Details
                    </button>
                </div>
            )}

            {/* Bottom Name & Mic Pill */}
            <div className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1.5 flex items-center justify-between gap-2 border-t border-slate-800">
                <span className="text-xs font-medium text-white truncate">{name}</span>
                <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isMuted
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                >
                    {isMuted ? 'Muted' : 'Speaking'}
                </span>
            </div>
        </div>
    );
};

export default ParticipantVideoTile;