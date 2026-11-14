import React, { useState } from 'react';
import ParticipantVideoTile from './ParticipantVideoTile';

const LiveSpeakerSpotlight = ({
    activeSpeaker,
    participants = [],
    isScreenSharing = false,
    screenShareOwner = 'Prof. Ramesh Sharma',
    isAudioOnly = false,
    onPinToggle,
    onInspectParticipant
}) => {
    const [showCaptions, setShowCaptions] = useState(true);
    const [stageZoom, setStageZoom] = useState(100);
    const [focusMode, setFocusMode] = useState('speaker'); // speaker, screen

    const effectiveStage = isScreenSharing && focusMode === 'screen' ? 'screen' : isScreenSharing ? 'screen' : 'speaker';

    const filmstripParticipants = participants.filter((p) => p.id !== activeSpeaker?.id).slice(0, 6);

    return (
        <div className="flex flex-col h-full w-full gap-3">
            {/* Stage Controls Strip */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="font-semibold text-white">
                        {effectiveStage === 'screen'
                            ? `Viewing Screen Share â€” ${screenShareOwner}`
                            : `Spotlight: ${activeSpeaker?.name || 'Instructor'}`}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {isScreenSharing && (
                        <button
                            type="button"
                            onClick={() => setFocusMode((prev) => (prev === 'screen' ? 'speaker' : 'screen'))}
                            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-teal-300 font-semibold"
                        >
                            {focusMode === 'screen' ? 'Focus Speaker' : 'Focus Slides'}
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => setShowCaptions((prev) => !prev)}
                        className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                            showCaptions ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-300'
                        }`}
                    >
                        {showCaptions ? 'Captions ON' : 'Captions OFF'}
                    </button>

                    <div className="hidden sm:flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-700">
                        <button
                            type="button"
                            onClick={() => setStageZoom((z) => Math.max(80, z - 10))}
                            className="px-1.5 text-slate-300 hover:text-white font-bold"
                        >
                            -
                        </button>
                        <span className="font-mono text-[11px] text-slate-300">{stageZoom}%</span>
                        <button
                            type="button"
                            onClick={() => setStageZoom((z) => Math.min(130, z + 10))}
                            className="px-1.5 text-slate-300 hover:text-white font-bold"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Presentation / Speaker Canvas */}
            <div className="relative flex-1 min-h-[260px] bg-slate-950 border border-slate-700 rounded-2xl overflow-hidden flex items-center justify-center p-4">
                {effectiveStage === 'screen' ? (
                    <div
                        className="w-full h-full flex flex-col items-center justify-center bg-slate-900 rounded-xl border border-slate-800 p-6 text-center transition-transform"
                        style={{ transform: `scale(${stageZoom / 100})` }}
                    >
                        <div className="max-w-lg space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-teal-500/20 text-teal-300">
                                Low-Bandwidth Vector Slide Stream
                            </span>
                            <h3 className="text-lg font-bold text-white mt-2">
                                Unit 4: Dijkstra Shortest Path & Distance Vector Routing
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                Streaming crisp slide frames at 12 KB/frame instead of raw 1080p video so 2G/3G students read diagrams clearly.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute w-28 h-28 rounded-full bg-teal-500/20 animate-ping"></span>
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-2 border-teal-300 z-10">
                                {(activeSpeaker?.name || 'I')[0]}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                {activeSpeaker?.name || 'Prof. Ramesh Sharma'}
                            </h3>
                            <p className="text-xs text-teal-400 font-medium">
                                {isAudioOnly ? 'Audio-First Rural Mode Active (32 kbps)' : 'Active Speaker on Stage'}
                            </p>
                        </div>
                    </div>
                )}

                {/* Accessibility / Low-Bandwidth Text Captions Strip */}
                {showCaptions && (
                    <div className="absolute bottom-3 inset-x-4 sm:inset-x-12 bg-black/75 backdrop-blur-sm border border-slate-700 rounded-xl px-4 py-2 text-center">
                        <p className="text-xs text-slate-100 leading-snug">
                            <span className="text-teal-400 font-bold mr-1.5">Live Transcript:</span>
                            "Notice how each router updates its distance table whenever a neighboring link cost drops..."
                        </p>
                    </div>
                )}
            </div>

            {/* Responsive Thumbnail Filmstrip */}
            {filmstripParticipants.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {filmstripParticipants.map((p) => (
                        <ParticipantVideoTile
                            key={p.id}
                            participant={p}
                            compact
                            onPinToggle={onPinToggle}
                            onInspectParticipant={onInspectParticipant}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LiveSpeakerSpotlight;