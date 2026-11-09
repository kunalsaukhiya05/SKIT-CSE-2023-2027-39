import React from 'react';
import { toast } from 'react-hot-toast';

const ParticipantProfileCardModal = ({
    participant,
    isOpen,
    onClose,
    isTeacherView = false,
    isPinned = false,
    onPinToggle,
    onMuteToggle,
    onRemoveParticipant
}) => {
    if (!isOpen || !participant) return null;

    const {
        id,
        name = 'Student',
        rollNo = '23CS000',
        role = 'student',
        isMuted = true,
        isVideoOn = false,
        audioOnly = false,
        signalStrength = 4,
        joinedAt = '10:02 AM',
        handRaiseCount = 1,
        location = 'Rural Node (Jaipur District)'
    } = participant;

    const signalLabel =
        signalStrength >= 4
            ? 'Strong (4G / Broadband)'
            : signalStrength === 3
            ? 'Moderate (3G Mobile)'
            : signalStrength === 2
            ? 'Weak (2G Edge)'
            : 'Critical (High Packet Loss)';

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Banner */}
                <div className="bg-gradient-to-r from-teal-700 to-emerald-700 px-5 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-slate-900/40 border border-white/30 flex items-center justify-center text-lg font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">{name}</h3>
                            <p className="text-[11px] text-teal-100">
                                {role === 'teacher' ? 'Faculty Instructor' : `Student â€¢ ${rollNo}`}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs px-2.5 py-1 rounded bg-black/25 hover:bg-black/40 text-white"
                    >
                        Close
                    </button>
                </div>

                {/* Live Telemetry & Engagement Stats */}
                <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Joined Time</span>
                            <span className="font-semibold text-white mt-0.5 block">{joinedAt}</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Attendance Status</span>
                            <span className="font-semibold text-emerald-400 mt-0.5 block">Verified Present</span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Stream Mode</span>
                            <span className="font-semibold text-teal-300 mt-0.5 block">
                                {audioOnly ? 'Audio Saver (24kbps)' : isVideoOn ? 'Video + Audio' : 'Audio Only'}
                            </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                            <span className="text-[10px] text-slate-400 uppercase block">Hand Raises</span>
                            <span className="font-semibold text-amber-300 mt-0.5 block">{handRaiseCount} this session</span>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-400">Network Health:</span>
                            <span className="font-semibold text-white">{signalLabel}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400">Region / Node:</span>
                            <span className="font-semibold text-slate-200">{location}</span>
                        </div>
                    </div>

                    {/* Host & Participant Actions */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => {
                                onPinToggle?.(id);
                                toast.success(isPinned ? `Unpinned ${name}` : `Pinned ${name} to stage`);
                            }}
                            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-semibold transition"
                        >
                            {isPinned ? 'Unpin from Main Stage' : 'Pin Participant to Stage'}
                        </button>

                        {isTeacherView && role !== 'teacher' && (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onMuteToggle?.(id);
                                        toast.success(isMuted ? `Sent unmute request to ${name}` : `Muted ${name}`);
                                    }}
                                    className="py-2 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white text-xs font-semibold transition"
                                >
                                    {isMuted ? 'Request Unmute' : 'Mute Mic'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onRemoveParticipant?.(id);
                                        onClose?.();
                                    }}
                                    className="py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold transition"
                                >
                                    Move to Lobby
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantProfileCardModal;