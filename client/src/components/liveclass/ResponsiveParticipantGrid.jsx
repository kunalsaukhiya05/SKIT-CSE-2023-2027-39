import React, { useState, useMemo } from 'react';
import ParticipantVideoTile from './ParticipantVideoTile';

const ResponsiveParticipantGrid = ({
    participants = [],
    pinnedId = null,
    isTeacherView = false,
    onPinToggle,
    onMuteToggle,
    onInspectParticipant
}) => {
    const [page, setPage] = useState(0);
    const [density, setDensity] = useState('auto'); // auto, compact, gallery
    const [prioritizeActive, setPrioritizeActive] = useState(true);

    const pageSize = density === 'compact' ? 12 : density === 'gallery' ? 9 : 6;

    const sortedParticipants = useMemo(() => {
        const list = [...participants];
        if (!prioritizeActive) return list;

        return list.sort((a, b) => {
            if (a.id === pinnedId) return -1;
            if (b.id === pinnedId) return 1;
            if (a.role === 'teacher' && b.role !== 'teacher') return -1;
            if (b.role === 'teacher' && a.role !== 'teacher') return 1;
            if (a.isSpeaking !== b.isSpeaking) return a.isSpeaking ? -1 : 1;
            if (a.handRaised !== b.handRaised) return a.handRaised ? -1 : 1;
            return (a.name || '').localeCompare(b.name || '');
        });
    }, [participants, pinnedId, prioritizeActive]);

    const totalPages = Math.max(1, Math.ceil(sortedParticipants.length / pageSize));
    const safePage = Math.min(page, totalPages - 1);
    const visibleSlice = sortedParticipants.slice(safePage * pageSize, (safePage + 1) * pageSize);

    const getGridColsClass = () => {
        if (density === 'compact') {
            return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
        }
        if (visibleSlice.length <= 1) return 'grid-cols-1 max-w-3xl mx-auto';
        if (visibleSlice.length === 2) return 'grid-cols-1 sm:grid-cols-2';
        if (visibleSlice.length <= 4) return 'grid-cols-1 sm:grid-cols-2';
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    };

    return (
        <div className="flex flex-col h-full w-full space-y-3">
            {/* Grid Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/70 border border-slate-700 rounded-xl px-3 py-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="font-semibold text-white">Participant Stage</span>
                    <span className="text-[11px] bg-slate-700 px-2 py-0.5 rounded-full text-slate-200">
                        {participants.length} Joined
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={prioritizeActive}
                            onChange={(e) => setPrioritizeActive(e.target.checked)}
                            className="rounded text-teal-500"
                        />
                        Auto-sort active & hands
                    </label>

                    <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700 text-[11px]">
                        {[
                            { id: 'auto', label: '6-Tile' },
                            { id: 'gallery', label: '9-Tile' },
                            { id: 'compact', label: '12-Compact' }
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                    setDensity(opt.id);
                                    setPage(0);
                                }}
                                className={`px-2 py-1 rounded-md font-medium transition ${
                                    density === opt.id
                                        ? 'bg-teal-600 text-white'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Responsive Participant Cards Grid */}
            {visibleSlice.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center bg-slate-900/50 border border-dashed border-slate-700 rounded-2xl p-8 text-center">
                    <p className="text-sm font-semibold text-slate-300">Waiting for participants to join</p>
                    <p className="text-xs text-slate-500 mt-1">
                        Share the classroom code or admit waiting students from the lobby.
                    </p>
                </div>
            ) : (
                <div className={`flex-1 grid ${getGridColsClass()} gap-3 auto-rows-fr overflow-y-auto pr-1`}>
                    {visibleSlice.map((p) => (
                        <ParticipantVideoTile
                            key={p.id}
                            participant={p}
                            isTeacherView={isTeacherView}
                            isPinned={p.id === pinnedId}
                            compact={density === 'compact'}
                            onPinToggle={onPinToggle}
                            onMuteToggle={onMuteToggle}
                            onInspectParticipant={onInspectParticipant}
                        />
                    ))}
                </div>
            )}

            {/* Pagination Footer for Large Rural Batches */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-slate-800/70 border border-slate-700 rounded-xl px-4 py-2 text-xs">
                    <span className="text-slate-400">
                        Showing {safePage * pageSize + 1}â€“{Math.min((safePage + 1) * pageSize, sortedParticipants.length)} of{' '}
                        {sortedParticipants.length}
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={safePage === 0}
                            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                            className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-semibold transition"
                        >
                            Previous
                        </button>
                        <span className="font-mono text-slate-200">
                            Page {safePage + 1} / {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={safePage >= totalPages - 1}
                            onClick={() => setPage((prev) => Math.min(totalPages - 1, prev + 1))}
                            className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white font-semibold transition"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResponsiveParticipantGrid;