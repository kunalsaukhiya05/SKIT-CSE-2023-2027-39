import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ClassroomWaitingRoom = ({
    classTitle = 'Computer Networks - Unit 4',
    instructorName = 'Prof. Ramesh Sharma',
    role = 'student',
    scheduledStartMinutes = 5,
    onAdmitEnter,
    onLeaveLobby
}) => {
    const isTeacher = role === 'teacher';
    const [countdownSeconds, setCountdownSeconds] = useState(scheduledStartMinutes * 60);
    const [micMuted, setMicMuted] = useState(true);
    const [cameraOff, setCameraOff] = useState(true);
    const [audioOnlyPref, setAudioOnlyPref] = useState(true);
    const [acceptedGuidelines, setAcceptedGuidelines] = useState(false);

    const [waitingStudents, setWaitingStudents] = useState([
        { id: 'st-1', name: 'Aarav Sharma', rollNo: '23CS001', networkTier: '3G Mobile', waitMins: 3 },
        { id: 'st-2', name: 'Bhavna Meena', rollNo: '23CS008', networkTier: '2G Edge', waitMins: 2 },
        { id: 'st-3', name: 'Chetan Verma', rollNo: '23CS014', networkTier: '4G Hotspot', waitMins: 1 },
        { id: 'st-4', name: 'Divya Soni', rollNo: '23CS021', networkTier: 'Broadband', waitMins: 1 }
    ]);

    useEffect(() => {
        if (countdownSeconds <= 0) return;
        const timer = setInterval(() => {
            setCountdownSeconds((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [countdownSeconds]);

    const formatCountdown = (totalSecs) => {
        const mins = Math.floor(totalSecs / 60);
        const secs = totalSecs % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleAdmitOne = (studentId) => {
        const target = waitingStudents.find((s) => s.id === studentId);
        setWaitingStudents((prev) => prev.filter((s) => s.id !== studentId));
        if (target) {
            toast.success(`Admitted ${target.name} into the classroom`);
        }
    };

    const handleDenyOne = (studentId) => {
        const target = waitingStudents.find((s) => s.id === studentId);
        setWaitingStudents((prev) => prev.filter((s) => s.id !== studentId));
        if (target) {
            toast(`Removed ${target.name} from lobby queue`);
        }
    };

    const handleAdmitAll = () => {
        if (waitingStudents.length === 0) return;
        const count = waitingStudents.length;
        setWaitingStudents([]);
        toast.success(`Admitted all ${count} waiting students`);
    };

    const handleEnterRoom = () => {
        if (!isTeacher && !acceptedGuidelines) {
            toast.error('Please acknowledge the classroom etiquette checklist first');
            return;
        }
        onAdmitEnter?.({ micMuted, cameraOff, audioOnlyPref });
        toast.success('Joining live classroom session...');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5">
                {/* Left Column: Class Info & Device Readiness */}
                <div className="lg:col-span-3 p-6 md:p-8 flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                Pre-Class Lobby
                            </span>
                            <span className="text-xs font-mono text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                                {countdownSeconds > 0
                                    ? `Starts in ${formatCountdown(countdownSeconds)}`
                                    : 'Session Ready to Begin'}
                            </span>
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold text-white leading-snug">{classTitle}</h1>
                        <p className="text-sm text-slate-300">Instructor: {instructorName}</p>
                    </div>

                    {/* Simulated Pre-Join Preview Box */}
                    <div className="relative bg-slate-950 border border-slate-700 rounded-xl h-52 flex flex-col items-center justify-center p-4 overflow-hidden">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-2xl font-bold shadow-lg mb-3">
                            {isTeacher ? 'T' : 'S'}
                        </div>
                        <p className="text-xs text-slate-300 font-medium">
                            {cameraOff
                                ? 'Camera is off (recommended for low-bandwidth rural networks)'
                                : 'Camera preview active'}
                        </p>

                        <div className="absolute bottom-3 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setMicMuted((prev) => !prev)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    micMuted
                                        ? 'bg-red-600/80 hover:bg-red-600 text-white'
                                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                                }`}
                            >
                                {micMuted ? 'Mic Muted' : 'Mic On'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setCameraOff((prev) => !prev)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                                    cameraOff
                                        ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                                        : 'bg-teal-600 hover:bg-teal-500 text-white'
                                }`}
                            >
                                {cameraOff ? 'Camera Off' : 'Camera On'}
                            </button>
                        </div>
                    </div>

                    {/* Low Bandwidth Mode Preference */}
                    <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-3">
                        <div>
                            <h3 className="text-xs font-bold text-teal-300">Rural Audio-First Entry</h3>
                            <p className="text-[11px] text-slate-400">
                                Joins with compressed 32 kbps audio and pauses incoming student video streams.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAudioOnlyPref((prev) => !prev)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition shrink-0 ${
                                audioOnlyPref
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-700 text-slate-300'
                            }`}
                        >
                            {audioOnlyPref ? 'Enabled' : 'Disabled'}
                        </button>
                    </div>
                </div>

                {/* Right Column: Host Queue (Teacher) or Etiquette Checklist (Student) */}
                <div className="lg:col-span-2 bg-slate-900/60 border-t lg:border-t-0 lg:border-l border-slate-700 p-6 flex flex-col justify-between space-y-5">
                    {isTeacher ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-bold text-white">
                                    Waiting Queue ({waitingStudents.length})
                                </h2>
                                <button
                                    type="button"
                                    onClick={handleAdmitAll}
                                    disabled={waitingStudents.length === 0}
                                    className="text-xs bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold px-2.5 py-1 rounded-lg transition"
                                >
                                    Admit All
                                </button>
                            </div>

                            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                                {waitingStudents.length === 0 ? (
                                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-700 rounded-xl">
                                        All queued students have been admitted.
                                    </div>
                                ) : (
                                    waitingStudents.map((st) => (
                                        <div
                                            key={st.id}
                                            className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between gap-2"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-white truncate">{st.name}</p>
                                                <p className="text-[11px] text-slate-400">
                                                    {st.rollNo} â€¢ {st.networkTier}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAdmitOne(st.id)}
                                                    className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded"
                                                >
                                                    Admit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDenyOne(st.id)}
                                                    className="px-2 py-1 text-[11px] font-semibold bg-slate-700 hover:bg-red-600 text-slate-200 rounded"
                                                >
                                                    Deny
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-white">Classroom Etiquette Checklist</h2>
                            <ul className="space-y-2.5 text-xs text-slate-300">
                                <li className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                                    1. Keep microphone muted unless called on from the Hand-Raise queue.
                                </li>
                                <li className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                                    2. Use Data Saver mode when signal drops below 3G for uninterrupted lecture audio.
                                </li>
                                <li className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                                    3. Attendance is automatically captured after 10 minutes of active presence.
                                </li>
                            </ul>

                            <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={acceptedGuidelines}
                                    onChange={(e) => setAcceptedGuidelines(e.target.checked)}
                                    className="rounded text-teal-500 focus:ring-teal-500"
                                />
                                I am ready to join the session respectfully
                            </label>
                        </div>
                    )}

                    <div className="space-y-2 pt-3 border-t border-slate-700">
                        <button
                            type="button"
                            onClick={handleEnterRoom}
                            className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-lg transition"
                        >
                            {isTeacher ? 'Start Live Classroom Now' : 'Request Entry to Class'}
                        </button>
                        <button
                            type="button"
                            onClick={() => onLeaveLobby?.()}
                            className="w-full py-2 border border-slate-600 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassroomWaitingRoom;