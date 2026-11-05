import React, { useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';

const ParticipantRosterScreen = ({
    participants = [],
    isTeacher = false,
    onMuteOne,
    onMuteAll,
    onDisableStudentCameras,
    onPinToggle,
    onInspectParticipant,
    onClose
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('all'); // all, hands, audioOnly, weakSignal

    const stats = useMemo(() => {
        return {
            total: participants.length,
            hands: participants.filter((p) => p.handRaised).length,
            audioOnly: participants.filter((p) => p.audioOnly).length,
            weakSignal: participants.filter((p) => (p.signalStrength || 4) <= 2).length
        };
    }, [participants]);

    const filteredList = useMemo(() => {
        return participants.filter((p) => {
            const matchesQuery =
                !searchQuery ||
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.rollNo?.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesQuery) return false;
            if (filterTab === 'hands') return Boolean(p.handRaised);
            if (filterTab === 'audioOnly') return Boolean(p.audioOnly);
            if (filterTab === 'weakSignal') return (p.signalStrength || 4) <= 2;
            return true;
        });
    }, [participants, searchQuery, filterTab]);

    const handleBulkMute = () => {
        onMuteAll?.();
        toast.success('Muted all student microphones');
    };

    const handleBandwidthAssist = () => {
        onDisableStudentCameras?.();
        toast.success('Requested students to pause video cameras for rural bandwidth relief');
    };

    return (
        <div className="bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-white">Live Participant Roster ({stats.total})</h2>
                    <p className="text-[11px] text-slate-400">Real-time attendance, network tier & moderation</p>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                    >
                        Close
                    </button>
                )}
            </div>

            {/* Search & Filter Tabs */}
            <div className="p-3 space-y-2.5 border-b border-slate-800 bg-slate-900/70">
                <input
                    type="text"
                    placeholder="Search student name or roll no..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold">
                    {[
                        { id: 'all', label: `All (${stats.total})` },
                        { id: 'hands', label: `Hands (${stats.hands})` },
                        { id: 'audioOnly', label: `Audio (${stats.audioOnly})` },
                        { id: 'weakSignal', label: `Low Net (${stats.weakSignal})` }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setFilterTab(tab.id)}
                            className={`py-1.5 rounded-lg transition truncate px-1 ${
                                filterTab === tab.id
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Teacher Bulk Bandwidth & Audio Controls */}
            {isTeacher && (
                <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-800 flex gap-2">
                    <button
                        type="button"
                        onClick={handleBulkMute}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition"
                    >
                        Mute All Students
                    </button>
                    <button
                        type="button"
                        onClick={handleBandwidthAssist}
                        className="flex-1 py-1.5 text-[11px] font-semibold rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white transition"
                    >
                        Save Class Bandwidth
                    </button>
                </div>
            )}

            {/* Participant List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
                {filteredList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400">
                        No participants match this filter.
                    </div>
                ) : (
                    filteredList.map((p) => (
                        <div
                            key={p.id}
                            className="px-3.5 py-2.5 flex items-center justify-between gap-2 hover:bg-slate-800/60 transition"
                        >
                            <div
                                className="min-w-0 flex-1 cursor-pointer"
                                onClick={() => onInspectParticipant?.(p)}
                            >
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white truncate">{p.name}</span>
                                    {p.role === 'teacher' && (
                                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-teal-600 text-white">
                                            Host
                                        </span>
                                    )}
                                    {p.handRaised && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                                            Hand
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>{p.rollNo || 'Participant'}</span>
                                    <span>â€¢</span>
                                    <span>{p.audioOnly ? 'Audio Saver' : p.isVideoOn ? 'Video On' : 'Cam Off'}</span>
                                    {(p.signalStrength || 4) <= 2 && (
                                        <span className="text-amber-400 font-semibold">â€¢ Weak Signal</span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => onPinToggle?.(p.id)}
                                    className="px-2 py-1 text-[10px] font-semibold rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300"
                                >
                                    Pin
                                </button>
                                {isTeacher && p.role !== 'teacher' && (
                                    <button
                                        type="button"
                                        onClick={() => onMuteOne?.(p.id)}
                                        className={`px-2 py-1 text-[10px] font-semibold rounded ${
                                            p.isMuted
                                                ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                        }`}
                                    >
                                        {p.isMuted ? 'Muted' : 'Mute'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ParticipantRosterScreen;